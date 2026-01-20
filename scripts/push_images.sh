#!/usr/bin/env bash
set -euo pipefail

# Build and push repository Docker images to Docker Hub
# Usage: NAMESPACE=0marmohamed ./scripts/push_images.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_FILE="$ROOT_DIR/VERSION"
NAMESPACE=${NAMESPACE:-0marmohamed}

if [ ! -f "$VERSION_FILE" ]; then
  echo "ERROR: VERSION file not found at $VERSION_FILE"
  exit 1
fi

VERSION=$(cat "$VERSION_FILE" | tr -d ' \t\n\r')
if [ -z "$VERSION" ]; then
  echo "ERROR: VERSION is empty"
  exit 1
fi

echo "Using Docker Hub namespace: $NAMESPACE"
echo "Using VERSION: $VERSION"

echo "Ensure you're logged into Docker Hub (docker login)."
docker info >/dev/null 2>&1 || true

function build_and_push() {
  local tag="$1"
  shift
  local build_args=("$@")

  echo "Building $tag from: ${build_args[*]}"
  docker build -t "$tag:$VERSION" -t "$tag:latest" "${build_args[@]}"
  echo "Pushing $tag:$VERSION"
  docker push "$tag:$VERSION"
  echo "Pushing $tag:latest"
  docker push "$tag:latest"
}

pushd "$ROOT_DIR" >/dev/null

# Frontend
build_and_push "$NAMESPACE/chloromaster-frontend" -f frontend/Dockerfile frontend

# Backend (build context is repository root so backend Dockerfile can access other directories)
build_and_push "$NAMESPACE/chloromaster-backend" -f backend/Dockerfile . --target final

# Nginx
build_and_push "$NAMESPACE/chloromaster-nginx" -f nginx/Dockerfile nginx

# Redis
build_and_push "$NAMESPACE/chloromaster-redis" -f redis/Dockerfile redis

# Monitoring images (Prometheus/Grafana) are intentionally skipped for this
# production stage. They can be added later when monitoring is required.

popd >/dev/null

echo "All requested images built and pushed to Docker Hub under ${NAMESPACE} (tags: ${VERSION}, latest)."
