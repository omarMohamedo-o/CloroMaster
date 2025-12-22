#!/bin/bash
# ==========================================
# Kubernetes Deployment Script
# ==========================================

set -e

echo "=========================================="
echo "ChloroMaster Kubernetes Deployment"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="chloromaster"
K8S_DIR="./k8s"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Check cluster connection
echo -e "${YELLOW}Checking Kubernetes cluster connection...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connected to cluster${NC}"

# Build Docker images (optional - set BUILD_IMAGES=true to enable)
if [ "${BUILD_IMAGES}" = "true" ]; then
    echo -e "${YELLOW}Building Docker images...${NC}"
    docker compose build
    echo -e "${GREEN}✓ Docker images built${NC}"
    
    # Tag and push images (update with your registry)
    echo -e "${YELLOW}Tagging images...${NC}"
    REGISTRY="${DOCKER_REGISTRY:-localhost:5000}"
    docker tag chloromaster/backend:latest ${REGISTRY}/chloromaster-backend:latest
    docker tag chloromaster/frontend:latest ${REGISTRY}/chloromaster-frontend:latest
    echo -e "${GREEN}✓ Images tagged${NC}"
    
    # Push to registry (set PUSH_IMAGES=true to enable)
    if [ "${PUSH_IMAGES}" = "true" ]; then
        echo -e "${YELLOW}Pushing images to registry...${NC}"
        docker push ${REGISTRY}/chloromaster-backend:latest
        docker push ${REGISTRY}/chloromaster-frontend:latest
        echo -e "${GREEN}✓ Images pushed${NC}"
    fi
else
    echo -e "${YELLOW}Skipping image build (set BUILD_IMAGES=true to build)${NC}"
    echo -e "${YELLOW}Assuming images are already available locally or in registry${NC}"
fi

# Apply Kubernetes configurations
echo -e "${YELLOW}Applying Kubernetes configurations...${NC}"

# Apply in order
kubectl apply -f ${K8S_DIR}/00-namespace.yaml
echo -e "${GREEN}✓ Namespace created${NC}"

kubectl apply -f ${K8S_DIR}/01-configmap.yaml
kubectl apply -f ${K8S_DIR}/02-secrets.yaml
echo -e "${GREEN}✓ ConfigMaps and Secrets created${NC}"

kubectl apply -f ${K8S_DIR}/03-pvc.yaml
echo -e "${GREEN}✓ Persistent Volume Claims created${NC}"

kubectl apply -f ${K8S_DIR}/04-backend-deployment.yaml
kubectl apply -f ${K8S_DIR}/05-frontend-deployment.yaml
echo -e "${GREEN}✓ Deployments created${NC}"

kubectl apply -f ${K8S_DIR}/06-services.yaml
echo -e "${GREEN}✓ Services created${NC}"

kubectl apply -f ${K8S_DIR}/07-hpa.yaml
echo -e "${GREEN}✓ Horizontal Pod Autoscalers created${NC}"

kubectl apply -f ${K8S_DIR}/08-ingress.yaml
echo -e "${GREEN}✓ Ingress created${NC}"

kubectl apply -f ${K8S_DIR}/09-pdb.yaml
echo -e "${GREEN}✓ Pod Disruption Budgets created${NC}"

kubectl apply -f ${K8S_DIR}/10-network-policy.yaml
echo -e "${GREEN}✓ Network Policies created${NC}"

kubectl apply -f ${K8S_DIR}/11-resource-limits.yaml
echo -e "${GREEN}✓ Resource Quotas and Limits created${NC}"

# Wait for deployments
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s \
    deployment/backend deployment/frontend -n ${NAMESPACE}
echo -e "${GREEN}✓ All deployments ready${NC}"

# Display status
echo ""
echo "=========================================="
echo "Deployment Status"
echo "=========================================="
kubectl get all -n ${NAMESPACE}

echo ""
echo "=========================================="
echo "HPA Status"
echo "=========================================="
kubectl get hpa -n ${NAMESPACE}

echo ""
echo "=========================================="
echo "Ingress Status"
echo "=========================================="
kubectl get ingress -n ${NAMESPACE}

echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Access your application:"
echo "  - Frontend: http://localhost (via Ingress)"
echo "  - Backend API: http://localhost/api"
echo "  - Admin Panel: http://localhost/admin/login"
echo ""
echo "Monitor with:"
echo "  kubectl get pods -n ${NAMESPACE} -w"
echo "  kubectl logs -f deployment/backend -n ${NAMESPACE}"
echo "  kubectl logs -f deployment/frontend -n ${NAMESPACE}"
echo ""
