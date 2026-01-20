#!/bin/bash
set -euo pipefail

REPO_URL="${repo_url}"
REPO_BRANCH="${repo_branch}"
APP_DIR="${app_dir}"
SSH_USER="${ssh_user}"

# Optional SSH public key passed from Terraform (string)
SSH_PUBLIC_KEY="${ssh_public_key}"

# SMTP / runtime env passed from Terraform variables
SMTP_HOST="${smtp_host}"
SMTP_PORT="${smtp_port}"
SMTP_FROM_EMAIL="${smtp_from_email}"
ALLOW_DATASHEET_WITHOUT_EMAIL="${allow_datasheet_without_email}"

# SSM parameter names (will be fetched on instance)
SMTP_USERNAME_SSM="${smtp_username_ssm}"
SMTP_PASSWORD_SSM="${smtp_password_ssm}"

# Docker image overrides
DOCKER_IMAGE_BACKEND="${docker_image_backend}"
DOCKER_IMAGE_FRONTEND="${docker_image_frontend}"
DOCKER_IMAGE_NGINX="${docker_image_nginx}"
DOCKER_IMAGE_REDIS="${docker_image_redis}"

# AWS region
AWS_REGION="${aws_region}"

echo "Cloud-init: installing prerequisites"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release git awscli

# Install Docker (official convenience script)
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sh /tmp/get-docker.sh
  usermod -aG docker $SSH_USER || true
fi

# Install Docker Compose plugin
if ! docker compose version >/dev/null 2>&1; then
  apt-get install -y docker-compose-plugin || true
fi


echo "Ensuring app directory exists and cloning repository"
mkdir -p "$APP_DIR"
chown $SSH_USER:$SSH_USER "$APP_DIR"
sudo -u $SSH_USER bash -lc "if [ -d \"$APP_DIR/.git\" ]; then git -C $APP_DIR fetch --all; git -C $APP_DIR checkout $REPO_BRANCH; git -C $APP_DIR pull origin $REPO_BRANCH; else git -C $APP_DIR clone --branch $REPO_BRANCH $REPO_URL $APP_DIR; fi"
## If a public SSH key was supplied, append it to the SSH user's authorized_keys
if [ -n "$SSH_PUBLIC_KEY" ]; then
  HOME_DIR=$(eval echo ~$${SSH_USER})
  mkdir -p "$HOME_DIR/.ssh"
  touch "$HOME_DIR/.ssh/authorized_keys"
  # avoid duplicate entries
  grep -qxF "$SSH_PUBLIC_KEY" "$HOME_DIR/.ssh/authorized_keys" || echo "$SSH_PUBLIC_KEY" >> "$HOME_DIR/.ssh/authorized_keys"
  chown -R $SSH_USER:$SSH_USER "$HOME_DIR/.ssh"
  chmod 700 "$HOME_DIR/.ssh"
  chmod 600 "$HOME_DIR/.ssh/authorized_keys"
fi
echo "Fetching SMTP credentials from SSM (AWS region: $AWS_REGION)"
export AWS_DEFAULT_REGION=$AWS_REGION
if [ -n "$SMTP_USERNAME_SSM" ]; then
  SMTP_USERNAME=$(aws ssm get-parameter --name "$SMTP_USERNAME_SSM" --with-decryption --query "Parameter.Value" --output text || true)
fi
if [ -n "$SMTP_PASSWORD_SSM" ]; then
  SMTP_PASSWORD=$(aws ssm get-parameter --name "$SMTP_PASSWORD_SSM" --with-decryption --query "Parameter.Value" --output text || true)
fi

# Create .env from fetched SMTP and runtime variables (securely)
cat > "$APP_DIR/.env" <<EOF
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5000
ConnectionStrings__DefaultConnection=Data Source=/app/data/chloromaster.db
Smtp__Host=$SMTP_HOST
Smtp__Port=$SMTP_PORT
Smtp__Username=$SMTP_USERNAME
Smtp__Password=$SMTP_PASSWORD
Smtp__UseSsl=true
Smtp__FromEmail=$SMTP_FROM_EMAIL
ALLOW_DATASHEET_WITHOUT_EMAIL=$ALLOW_DATASHEET_WITHOUT_EMAIL
EOF
chown $SSH_USER:$SSH_USER "$APP_DIR/.env"
chmod 600 "$APP_DIR/.env"

echo "Starting Docker Compose prod stack (pull images then up)"
sudo -u $SSH_USER bash -lc "cd $APP_DIR && docker compose -f docker-compose.prod.yml pull || true"
sudo -u $SSH_USER bash -lc "cd $APP_DIR && docker compose -f docker-compose.prod.yml up -d --remove-orphans"

cat > /etc/systemd/system/chloromaster-redeploy.service <<EOF
[Unit]
Description=Redeploy ChloroMaster (run docker compose up -d)
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/docker compose -f $APP_DIR/docker-compose.prod.yml pull
ExecStart=/usr/bin/docker compose -f $APP_DIR/docker-compose.prod.yml up -d --build

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload || true
systemctl enable --now chloromaster-redeploy.service || true

echo "Cloud-init finished"
