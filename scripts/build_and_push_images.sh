#!/usr/bin/env bash
set -euo pipefail

# Build and push ChloroMaster Production images to Docker Hub
# Usage:
#   DOCKERHUB_NAMESPACE=youruser ./scripts/build_and_push_images.sh
# Requires: docker login previously executed in the shell

NS=${DOCKERHUB_NAMESPACE:?Please set DOCKERHUB_NAMESPACE}
TAG_LATEST=${IMAGE_TAG_LATEST:-latest}
TAG_RELEASE=${IMAGE_TAG_RELEASE:-$(cat VERSION 2>/dev/null || echo "1.0.0")}

echo "=========================================="
echo "🚀 ChloroMaster Production Image Builder"
echo "=========================================="
echo "Docker Hub Namespace: ${NS}"
echo "Latest Tag: ${TAG_LATEST}"
echo "Release Tag: ${TAG_RELEASE}"
echo "=========================================="

echo "📦 Building production images (direct docker build + tagging)..."

# Map service names to Dockerfile contexts and final image names
declare -A SERVICES=(
  [frontend]=frontend
  [backend]=backend
  [nginx]=nginx
  [redis]=redis
)

for svc in "${!SERVICES[@]}"; do
  ctx="${SERVICES[$svc]}"
  hub_latest="${NS}/chloromaster-${svc}:${TAG_LATEST}"
  hub_release="${NS}/chloromaster-${svc}:${TAG_RELEASE}"

  echo ""
  echo "🏷️  Building service: ${svc} (context: ${ctx})"

  # Build image using Dockerfile in the service folder if present, otherwise fall back to compose build
  if [ -f "${ctx}/Dockerfile" ]; then
    docker build --pull --no-cache -t "${hub_latest}" "${ctx}"
  else
    echo "   Dockerfile not found at ${ctx}/Dockerfile, using 'docker compose build ${svc}' as fallback"
    docker compose build --pull --no-cache "${svc}"
    # try to tag a likely local name
    local_guess="chloromaster-${svc}:latest"
    if docker image inspect "${local_guess}" >/dev/null 2>&1; then
      docker tag "${local_guess}" "${hub_latest}"
    fi
  fi

  echo "   Pushing latest: ${hub_latest}"
  docker push "${hub_latest}"

  echo "   Tagging release: ${hub_release}"
  docker tag "${hub_latest}" "${hub_release}"

  echo "   Pushing release: ${hub_release}"
  docker push "${hub_release}"

  echo "   ✅ ${svc} pushed successfully"
done

echo ""
echo "=========================================="
echo "✅ All production images pushed successfully!"
echo "=========================================="
echo ""
echo "📝 Use these images in production:"
echo "   Frontend: ${NS}/chloromaster-frontend:${TAG_RELEASE}"
echo "   Backend:  ${NS}/chloromaster-backend:${TAG_RELEASE}"
echo "   Nginx:    ${NS}/chloromaster-nginx:${TAG_RELEASE}"
echo "   Redis:    ${NS}/chloromaster-redis:${TAG_RELEASE}"
echo ""
echo "🔒 Remember to:"
echo "   1. Update your production docker-compose.yml with these image names"
echo "   2. Set environment variables in .env file"
echo "   3. Configure SSL certificates for HTTPS"
echo "   4. Point Cloudflare DNS to your AWS Lightsail static IP"
echo "=========================================="
