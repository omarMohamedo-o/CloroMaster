#!/bin/bash
# ==========================================
# Kubernetes Cleanup Script
# ==========================================

set -e

NAMESPACE="chloromaster"

echo "=========================================="
echo "ChloroMaster Kubernetes Cleanup"
echo "=========================================="

read -p "Are you sure you want to delete all resources? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cleanup cancelled"
    exit 0
fi

echo "Deleting resources..."

# Delete in reverse order
kubectl delete -f ./k8s/11-resource-limits.yaml --ignore-not-found=true
kubectl delete -f ./k8s/10-network-policy.yaml --ignore-not-found=true
kubectl delete -f ./k8s/09-pdb.yaml --ignore-not-found=true
kubectl delete -f ./k8s/08-ingress.yaml --ignore-not-found=true
kubectl delete -f ./k8s/07-hpa.yaml --ignore-not-found=true
kubectl delete -f ./k8s/06-services.yaml --ignore-not-found=true
kubectl delete -f ./k8s/05-frontend-deployment.yaml --ignore-not-found=true
kubectl delete -f ./k8s/04-backend-deployment.yaml --ignore-not-found=true
kubectl delete -f ./k8s/03-pvc.yaml --ignore-not-found=true
kubectl delete -f ./k8s/02-secrets.yaml --ignore-not-found=true
kubectl delete -f ./k8s/01-configmap.yaml --ignore-not-found=true

# Optionally delete namespace (will delete everything inside)
read -p "Delete namespace '$NAMESPACE'? (yes/no): " delete_ns
if [ "$delete_ns" = "yes" ]; then
    kubectl delete namespace $NAMESPACE --ignore-not-found=true
    echo "Namespace deleted"
else
    echo "Namespace preserved"
fi

echo "Cleanup complete!"
