#!/bin/bash
# ==========================================
# Update Deployment Script (Rolling Update)
# ==========================================

set -e

NAMESPACE="chloromaster"

echo "=========================================="
echo "ChloroMaster Rolling Update"
echo "=========================================="

# Build new images
echo "Building new Docker images..."
docker-compose build

# Tag with timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag chloromaster/backend:latest chloromaster/backend:${TIMESTAMP}
docker tag chloromaster/frontend:latest chloromaster/frontend:${TIMESTAMP}

# Update deployments
echo "Updating backend deployment..."
kubectl set image deployment/backend backend=chloromaster/backend:latest -n ${NAMESPACE}
kubectl rollout status deployment/backend -n ${NAMESPACE}

echo "Updating frontend deployment..."
kubectl set image deployment/frontend frontend=chloromaster/frontend:latest -n ${NAMESPACE}
kubectl rollout status deployment/frontend -n ${NAMESPACE}

echo "Update complete!"
