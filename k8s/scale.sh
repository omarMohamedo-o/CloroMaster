#!/bin/bash
# ==========================================
# Scale Deployment Script
# ==========================================

NAMESPACE="chloromaster"

if [ $# -eq 0 ]; then
    echo "Usage: ./scale.sh <backend|frontend|both> <replicas>"
    echo "Example: ./scale.sh backend 5"
    exit 1
fi

TARGET=$1
REPLICAS=$2

case $TARGET in
    backend)
        echo "Scaling backend to $REPLICAS replicas..."
        kubectl scale deployment/backend --replicas=$REPLICAS -n $NAMESPACE
        ;;
    frontend)
        echo "Scaling frontend to $REPLICAS replicas..."
        kubectl scale deployment/frontend --replicas=$REPLICAS -n $NAMESPACE
        ;;
    both)
        echo "Scaling both backend and frontend to $REPLICAS replicas..."
        kubectl scale deployment/backend --replicas=$REPLICAS -n $NAMESPACE
        kubectl scale deployment/frontend --replicas=$REPLICAS -n $NAMESPACE
        ;;
    *)
        echo "Invalid target. Use: backend, frontend, or both"
        exit 1
        ;;
esac

echo "Scaling complete!"
kubectl get pods -n $NAMESPACE
