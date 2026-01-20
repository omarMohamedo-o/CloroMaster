#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 --host HOST [--ssh-key KEY] --cert ./origin.crt --key ./origin.key [--user USER]

Copies Cloudflare Origin Certificate and private key to the remote host and reloads the nginx service in the docker-compose stack.

Options:
  --host HOST            Remote host (public IP or DNS) where Chloromaster is running
  --ssh-key PATH         SSH private key to use (optional; uses default ssh agent or ~/.ssh/id_rsa)
  --cert PATH            Local path to Cloudflare origin certificate (PEM)
  --key PATH             Local path to Cloudflare origin private key (PEM)
  --user USER            SSH user (default: chloromaster)
  --remote-path PATH     Remote folder where compose is located (default: /home/chloromaster/chloromaster)
EOF
  exit 1
}

HOST=""
SSH_KEY=""
CERT=""
KEY=""
USER="chloromaster"
REMOTE_PATH="/home/chloromaster/chloromaster"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="$2"; shift 2;;
    --ssh-key) SSH_KEY="$2"; shift 2;;
    --cert) CERT="$2"; shift 2;;
    --key) KEY="$2"; shift 2;;
    --user) USER="$2"; shift 2;;
    --remote-path) REMOTE_PATH="$2"; shift 2;;
    -h|--help) usage;;
    *) echo "Unknown arg: $1"; usage;;
  esac
done

if [ -z "$HOST" ] || [ -z "$CERT" ] || [ -z "$KEY" ]; then
  usage
fi

if [ ! -f "$CERT" ]; then
  echo "Certificate file not found: $CERT" >&2
  exit 2
fi
if [ ! -f "$KEY" ]; then
  echo "Key file not found: $KEY" >&2
  exit 2
fi

SCP_OPTS=("-o" "StrictHostKeyChecking=accept-new")
SSH_OPTS=("-o" "StrictHostKeyChecking=accept-new")
if [ -n "$SSH_KEY" ]; then
  SCP_OPTS+=("-i" "$SSH_KEY")
  SSH_OPTS+=("-i" "$SSH_KEY")
fi

TMP_CERT="/tmp/cf_origin.crt"
TMP_KEY="/tmp/cf_origin.key"

echo "Copying certificate and key to $HOST:/tmp ..."
scp "${SCP_OPTS[@]}" "$CERT" "${USER}@${HOST}:$TMP_CERT"
scp "${SCP_OPTS[@]}" "$KEY" "${USER}@${HOST}:$TMP_KEY"

# Remote commands: move into /etc/ssl and restart nginx container
REMOTE_CMDS=$(cat <<'RC'
set -xe
sudo mkdir -p /etc/ssl /etc/ssl/private
sudo mv /tmp/cf_origin.crt /etc/ssl/cf_origin.crt
sudo mv /tmp/cf_origin.key /etc/ssl/private/cf_origin.key
sudo chown root:root /etc/ssl/cf_origin.crt /etc/ssl/private/cf_origin.key
sudo chmod 644 /etc/ssl/cf_origin.crt
sudo chmod 600 /etc/ssl/private/cf_origin.key
# Ensure parent permissions allow docker to read the key
sudo chmod 700 /etc/ssl/private || true
# Reload nginx inside container by recreating the nginx service
cd "${REMOTE_PATH}"
# Pull latest nginx image (optional)
# sudo -u ${USER} docker compose pull nginx || true
sudo -u ${USER} bash -lc "cd '${REMOTE_PATH}' && docker compose up -d --no-build nginx"
RC
)

echo "Installing certificate and reloading nginx on ${HOST}..."
ssh "${SSH_OPTS[@]}" "${USER}@${HOST}" "$REMOTE_CMDS"

echo "Done. The nginx container should now serve TLS using the installed Cloudflare Origin Certificate."

exit 0
