# ⚡ Kubernetes Quick Reference - ChloroMaster

## 🚀 Deploy Application

```bash
# Start local cluster
minikube start --cpus=4 --memory=8192
minikube addons enable ingress metrics-server

# Deploy everything
cd /home/omar/Projects/CloroMaster
./k8s/deploy.sh
```

## 📊 Monitor & Check

```bash
# Status
./k8s/status.sh                           # All resources
kubectl get pods -n chloromaster -w       # Watch pods
kubectl get hpa -n chloromaster           # Auto-scaling status
kubectl top pods -n chloromaster          # Resource usage

# Logs
kubectl logs -f deployment/backend -n chloromaster
kubectl logs -f deployment/frontend -n chloromaster
```

## 🔧 Scale

```bash
# Auto-scaling (configured)
Backend:  2-10 pods (70% CPU, 80% Memory)
Frontend: 3-15 pods (60% CPU, 70% Memory)

# Manual scaling
./k8s/scale.sh backend 5
./k8s/scale.sh frontend 10
```

## 🔄 Update & Rollback

```bash
# Update
./k8s/update.sh

# Rollback
kubectl rollout undo deployment/backend -n chloromaster
kubectl rollout undo deployment/frontend -n chloromaster

# Check rollout
kubectl rollout status deployment/backend -n chloromaster
```

## 🌐 Access Application

```bash
# Port forward
kubectl port-forward -n chloromaster svc/frontend-service 3000:3000 &
kubectl port-forward -n chloromaster svc/backend-service 5000:5000 &

# URLs
Frontend: http://localhost:3000
Backend:  http://localhost:5000/api
Admin:    http://localhost:3000/admin/login
```

## 🧪 Load Testing

```bash
# Install
go install github.com/rakyll/hey@latest

# Test
hey -z 5m -c 50 -q 10 http://localhost:3000      # Frontend
hey -z 5m -c 30 -q 5 http://localhost:5000/api   # Backend

# Watch scaling
watch kubectl get hpa -n chloromaster
```

## 💾 Database Operations

```bash
# Backup
mkdir -p backups
POD=$(kubectl get pod -n chloromaster -l app=backend -o jsonpath="{.items[0].metadata.name}")
kubectl cp chloromaster/$POD:/app/data/chloromaster.db ./backups/backup-$(date +%Y%m%d).db

# Restore
kubectl cp ./backups/backup.db chloromaster/$POD:/app/data/chloromaster.db
```

## 🧹 Cleanup

```bash
./k8s/cleanup.sh                # Clean resources
kubectl delete namespace chloromaster  # Delete everything
```

## 🆘 Troubleshooting

```bash
# Events
kubectl get events -n chloromaster --sort-by='.lastTimestamp'

# Describe
kubectl describe pod <pod-name> -n chloromaster
kubectl describe hpa backend-hpa -n chloromaster

# Shell access
kubectl exec -it deployment/backend -n chloromaster -- /bin/bash
```

## 📦 Makefile Commands

```bash
cd k8s/

make help          # Show all commands
make deploy        # Deploy application
make status        # Show status
make logs-backend  # Backend logs
make logs-frontend # Frontend logs
make scale-up      # Scale up (5 backend, 10 frontend)
make scale-down    # Scale down (2 backend, 3 frontend)
make update        # Rolling update
make hpa           # HPA status
make port-forward  # Port forward services
make cleanup       # Delete all
```

## 🎯 Quick Checks

```bash
# Are pods running?
kubectl get pods -n chloromaster

# Is auto-scaling working?
kubectl get hpa -n chloromaster

# What's the resource usage?
kubectl top pods -n chloromaster

# Any errors?
kubectl get events -n chloromaster --field-selector type=Warning

# Is ingress working?
kubectl get ingress -n chloromaster
```

## 📈 Cluster Resources

**Frontend**: 100-200m CPU, 128-256Mi memory (3-15 pods)
**Backend**: 250-500m CPU, 256-512Mi memory (2-10 pods)
**Storage**: 5Gi data + 2Gi logs

**Minimum Cluster**: 4 CPUs, 8GB RAM, 50GB disk
**Recommended**: 8 CPUs, 16GB RAM, 100GB disk

---

**Full Documentation**: `KUBERNETES_GUIDE.md`
