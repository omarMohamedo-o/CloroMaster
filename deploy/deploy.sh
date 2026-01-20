#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 user@server [ssh_key_path] [dest_path]"
  exit 1
fi

SERVER="$1"
SSH_KEY="${2:-$HOME/.ssh/id_rsa}"
DEST="${3:-/home/$(echo "$SERVER" | cut -d@ -f1)/chloromaster}"

echo "Syncing repository to $SERVER:$DEST"
rsync -avz --delete --exclude '.git' --exclude 'node_modules' --exclude 'build' --exclude '.env' ./ "$SERVER:$DEST"

echo "Ensuring Docker is installed and setting up service on remote host"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SERVER" bash -s <<'REMOTE'
set -euo pipefail
DEST="${DEST:=/home/ubuntu/chloromaster}"
mkdir -p "$DEST"
if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y docker.io docker-compose-plugin
fi

sudo chown -R $(whoami):$(whoami) "$DEST" || true

if [ ! -f "$DEST/.env" ]; then
  if [ -f "$DEST/.env.example" ]; then
    cp "$DEST/.env.example" "$DEST/.env"
    echo "Copied .env.example to .env — edit $DEST/.env with production secrets"
  else
    echo "WARNING: .env.example not found on server; create $DEST/.env manually"
  fi
fi

sudo tee /etc/systemd/system/chloromaster.service > /dev/null <<'UNIT'
[Unit]
Description=ChloroMaster Docker Compose stack
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=%DEST%
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0
Restart=always

[Install]
WantedBy=multi-user.target
UNIT

sudo sed -i "s|%DEST%|$DEST|g" /etc/systemd/system/chloromaster.service
sudo systemctl daemon-reload
sudo systemctl enable --now chloromaster.service || true

sudo /usr/bin/docker compose -f "$DEST/docker-compose.yml" up -d --build
REMOTE

echo "Deployment complete. Check logs with: ssh -i $SSH_KEY $SERVER 'docker compose -f $DEST/docker-compose.yml logs -f'"
