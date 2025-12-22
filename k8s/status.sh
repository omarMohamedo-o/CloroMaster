#!/bin/bash
# ==========================================
# Monitoring and Status Script
# ==========================================

NAMESPACE="chloromaster"

echo "=========================================="
echo "ChloroMaster Cluster Status"
echo "=========================================="

echo ""
echo "=== PODS ==="
kubectl get pods -n $NAMESPACE -o wide

echo ""
echo "=== DEPLOYMENTS ==="
kubectl get deployments -n $NAMESPACE

echo ""
echo "=== SERVICES ==="
kubectl get services -n $NAMESPACE

echo ""
echo "=== HORIZONTAL POD AUTOSCALERS ==="
kubectl get hpa -n $NAMESPACE

echo ""
echo "=== INGRESS ==="
kubectl get ingress -n $NAMESPACE

echo ""
echo "=== PERSISTENT VOLUME CLAIMS ==="
kubectl get pvc -n $NAMESPACE

echo ""
echo "=== RESOURCE USAGE ==="
kubectl top pods -n $NAMESPACE 2>/dev/null || echo "Metrics server not available"

echo ""
echo "=== EVENTS (Last 10) ==="
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -10

echo ""
echo "=== POD DISRUPTION BUDGETS ==="
kubectl get pdb -n $NAMESPACE

echo ""
echo "=========================================="
echo "To view logs:"
echo "  kubectl logs -f deployment/backend -n $NAMESPACE"
echo "  kubectl logs -f deployment/frontend -n $NAMESPACE"
echo ""
echo "To describe a resource:"
echo "  kubectl describe pod <pod-name> -n $NAMESPACE"
echo "=========================================="
