# ChloroMaster Kubernetes Deployment Guide

## 🎯 Overview

Complete Kubernetes deployment configuration for ChloroMaster with auto-scaling, high availability, and production-ready security features.

## 📋 Prerequisites

### Required Tools

- **Kubernetes Cluster** (v1.24+)
  - Local: Minikube, Kind, Docker Desktop
  - Cloud: GKE, EKS, AKS
- **kubectl** (v1.24+)
- **Docker** (v20.10+)
- **Helm** (v3.10+) - Optional but recommended

### Cluster Requirements

- **Minimum Resources**:
  - 4 CPU cores
  - 8GB RAM
  - 50GB storage

- **Add-ons Required**:
  - Metrics Server (for HPA)
  - Ingress Controller (nginx)
  - Storage Provisioner

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────┐
│         Ingress Controller (nginx)      │
│     SSL/TLS, Rate Limiting, CORS        │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌─────▼──────┐
│  Frontend  │   │   Backend  │
│  (React)   │   │  (.NET 8)  │
│  3-15 pods │   │  2-10 pods │
└────────────┘   └──────┬─────┘
                        │
                 ┌──────▼──────┐
                 │  SQLite DB  │
                 │ (Persistent) │
                 └─────────────┘
```

### Auto-scaling Configuration

**Frontend (React + Nginx)**

- Min replicas: 3
- Max replicas: 15
- CPU threshold: 60%
- Memory threshold: 70%

**Backend (.NET API)**

- Min replicas: 2
- Max replicas: 10
- CPU threshold: 70%
- Memory threshold: 80%

## 🚀 Quick Start

### 1. Install Kubernetes Cluster

**Option A: Minikube (Local Development)**

```bash
# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster with sufficient resources
minikube start --cpus=4 --memory=8192 --disk-size=50g

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable storage-provisioner
```

**Option B: Kind (Local Development)**

```bash
# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
kind create cluster --config k8s/kind-config.yaml
```

**Option C: Cloud Provider**

```bash
# GKE
gcloud container clusters create chloromaster-cluster \
  --num-nodes=3 --machine-type=n1-standard-2

# EKS
eksctl create cluster --name chloromaster-cluster \
  --nodes=3 --node-type=t3.medium

# AKS
az aks create --resource-group chloromaster-rg \
  --name chloromaster-cluster --node-count=3
```

### 2. Install Ingress Controller

```bash
# Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for it to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

### 3. Install Metrics Server (for HPA)

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### 4. Configure Secrets

**Edit k8s/02-secrets.yaml** and update:

- Database connection string
- Password salt
- Google Analytics ID
- JWT secret

```bash
# Generate strong JWT secret
openssl rand -base64 32
```

### 5. Deploy Application

```bash
cd /home/omar/Projects/CloroMaster

# Run deployment script
./k8s/deploy.sh
```

**Or deploy manually:**

```bash
# Apply configurations in order
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/03-pvc.yaml
kubectl apply -f k8s/04-backend-deployment.yaml
kubectl apply -f k8s/05-frontend-deployment.yaml
kubectl apply -f k8s/06-services.yaml
kubectl apply -f k8s/07-hpa.yaml
kubectl apply -f k8s/08-ingress.yaml
kubectl apply -f k8s/09-pdb.yaml
kubectl apply -f k8s/10-network-policy.yaml
kubectl apply -f k8s/11-resource-limits.yaml
```

### 6. Verify Deployment

```bash
# Check all resources
./k8s/status.sh

# Or manually
kubectl get all -n chloromaster
kubectl get hpa -n chloromaster
kubectl get ingress -n chloromaster
```

## 🔍 Monitoring & Management

### Check Pod Status

```bash
kubectl get pods -n chloromaster -w
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n chloromaster

# Frontend logs
kubectl logs -f deployment/frontend -n chloromaster

# All pods
kubectl logs -f -l app=backend -n chloromaster
```

### Check Auto-scaling

```bash
# HPA status
kubectl get hpa -n chloromaster

# Resource usage
kubectl top pods -n chloromaster
kubectl top nodes
```

### Access Application

**Port Forward (Development)**

```bash
# Frontend
kubectl port-forward -n chloromaster svc/frontend-service 3000:3000

# Backend API
kubectl port-forward -n chloromaster svc/backend-service 5000:5000

# Then access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000/api
# - Admin Dashboard: http://localhost:3000/admin/login
```

**Via Ingress (Production)**

```bash
# Get Ingress IP
kubectl get ingress -n chloromaster

# For Minikube
minikube ip  # Use this IP

# Update /etc/hosts
echo "<INGRESS-IP> chloromaster.com" | sudo tee -a /etc/hosts

# Or for Minikube, use tunnel
minikube tunnel  # Run in separate terminal

# Then access:
# - Frontend: http://chloromaster.com
# - Backend API: http://chloromaster.com/api
# - Admin Dashboard: http://chloromaster.com/admin/login
```

## 🔐 Admin Dashboard Access

### Default Credentials

After deployment, you can access the admin dashboard with:

- **URL**: `http://localhost:3000/admin/login` (port-forward) or `http://chloromaster.com/admin/login` (ingress)
- **Username**: `admin`
- **Password**: `Admin@123`

### First Login

```bash
# 1. Port-forward the frontend service
kubectl port-forward -n chloromaster svc/frontend-service 3000:3000

# 2. Open browser
xdg-open http://localhost:3000/admin/login

# 3. Login with credentials
# Username: admin
# Password: Admin@123

# 4. IMPORTANT: Change password immediately after first login!
```

### Admin Dashboard Features

The admin panel provides:

- 📊 **Dashboard**: Overview of system metrics
- 📧 **Contact Management**: View and respond to contact form submissions
- 🛠️ **Service Management**: Add, edit, and delete services
- 👥 **User Management**: Manage admin users (future feature)
- 📈 **Analytics**: View website traffic and engagement

### Change Admin Password

**Option 1: Via Admin Panel (Recommended)**

1. Login to admin dashboard
2. Navigate to Settings > Change Password
3. Enter new password and confirm

**Option 2: Via Database (If locked out)**

```bash
# Get backend pod name
POD=$(kubectl get pod -n chloromaster -l app=backend -o jsonpath="{.items[0].metadata.name}")

# Access database
kubectl exec -it -n chloromaster $POD -- sqlite3 /app/data/chloromaster.db

# Generate new password hash (use your own password hashing tool)
# Then update:
UPDATE AdminUsers 
SET PasswordHash = 'your-new-hash-here' 
WHERE Username = 'admin';

# Exit
.quit
```

### Security Recommendations

⚠️ **CRITICAL SECURITY STEPS**:

1. **Change default password immediately** after first deployment
2. **Use strong passwords** (min 12 characters, mixed case, numbers, symbols)
3. **Enable 2FA** (future feature)
4. **Limit admin access** to trusted IPs only (configure in ingress)
5. **Regular password rotation** (every 90 days recommended)
6. **Monitor admin access logs**

### Troubleshooting Admin Access

**Cannot access admin dashboard:**

```bash
# Check frontend pod is running
kubectl get pods -n chloromaster -l app=frontend

# Check frontend logs
kubectl logs -f -n chloromaster deployment/frontend

# Verify port-forward
kubectl port-forward -n chloromaster svc/frontend-service 3000:3000
```

**Login fails:**

```bash
# Check backend is running
kubectl get pods -n chloromaster -l app=backend

# Check backend logs
kubectl logs -f -n chloromaster deployment/backend

# Verify database has admin user
POD=$(kubectl get pod -n chloromaster -l app=backend -o jsonpath="{.items[0].metadata.name}")
kubectl exec -it -n chloromaster $POD -- sqlite3 /app/data/chloromaster.db "SELECT * FROM AdminUsers;"
```

**Database migration not run:**

```bash
# Check migration logs
kubectl logs -n chloromaster deployment/backend -c db-migration

# If migration failed, check for errors and redeploy
kubectl delete pod -n chloromaster -l app=backend
```

## 📊 Auto-scaling Scenarios

### Test Auto-scaling

**Load Test Frontend**

```bash
# Install hey (load testing tool)
go install github.com/rakyll/hey@latest

# Generate load
hey -z 5m -c 50 -q 10 http://chloromaster.com

# Watch scaling
watch kubectl get hpa -n chloromaster
```

**Load Test Backend**

```bash
# API load test
hey -z 5m -c 30 -q 5 http://chloromaster.com/api/services

# Watch pods scale
watch kubectl get pods -n chloromaster
```

### Manual Scaling

```bash
# Scale manually
./k8s/scale.sh backend 5
./k8s/scale.sh frontend 8
./k8s/scale.sh both 4

# Or with kubectl
kubectl scale deployment/backend --replicas=5 -n chloromaster
```

## 🔄 Updates & Rollbacks

### Rolling Update

```bash
# Build and update
./k8s/update.sh

# Or manually
docker-compose build
kubectl set image deployment/backend backend=chloromaster/backend:latest -n chloromaster
kubectl set image deployment/frontend frontend=chloromaster/frontend:latest -n chloromaster
```

### Check Rollout Status

```bash
kubectl rollout status deployment/backend -n chloromaster
kubectl rollout status deployment/frontend -n chloromaster
```

### Rollback

```bash
# View history
kubectl rollout history deployment/backend -n chloromaster

# Rollback to previous
kubectl rollout undo deployment/backend -n chloromaster

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2 -n chloromaster
```

## 🔐 Security Features

### Implemented Security

- ✅ Non-root containers
- ✅ Read-only root filesystem (where possible)
- ✅ Security context constraints
- ✅ Network policies (pod-to-pod isolation)
- ✅ Resource quotas and limits
- ✅ Pod disruption budgets
- ✅ Secret management
- ✅ TLS/SSL termination
- ✅ Rate limiting
- ✅ Security headers

### SSL/TLS Configuration

**Install Cert-Manager**

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

**Create Certificate Issuer**

```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@chloromaster.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## 💾 Backup & Restore

### Backup Database

```bash
# Get backend pod name
POD=$(kubectl get pod -n chloromaster -l app=backend -o jsonpath="{.items[0].metadata.name}")

# Copy database
kubectl cp chloromaster/$POD:/app/data/chloromaster.db ./backup/chloromaster-$(date +%Y%m%d).db
```

### Restore Database

```bash
# Copy to pod
kubectl cp ./backup/chloromaster-20250101.db chloromaster/$POD:/app/data/chloromaster.db
```

## 🧹 Cleanup

```bash
# Run cleanup script
./k8s/cleanup.sh

# Or manually delete namespace
kubectl delete namespace chloromaster
```

## 📈 Production Checklist

- [ ] Configure production secrets
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain DNS
- [ ] Enable monitoring (Prometheus/Grafana)
- [ ] Set up log aggregation
- [ ] Configure backup strategy
- [ ] Test auto-scaling
- [ ] Test disaster recovery
- [ ] Configure alerting
- [ ] Document runbooks

## 🛠️ Troubleshooting

### Pods Not Starting

```bash
# Describe pod
kubectl describe pod <pod-name> -n chloromaster

# Check events
kubectl get events -n chloromaster --sort-by='.lastTimestamp'
```

### HPA Not Working

```bash
# Check metrics server
kubectl get apiservice v1beta1.metrics.k8s.io -o yaml

# Check HPA
kubectl describe hpa backend-hpa -n chloromaster
```

### Ingress Not Working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress resource
kubectl describe ingress chloromaster-ingress -n chloromaster
```

### Database Connection Issues

```bash
# Check PVC
kubectl get pvc -n chloromaster

# Check volume mount
kubectl exec -it deployment/backend -n chloromaster -- ls -la /app/data
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Ingress Controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
- [Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

## 🆘 Support

For issues or questions:

1. Check logs: `kubectl logs -f deployment/backend -n chloromaster`
2. Check events: `kubectl get events -n chloromaster`
3. Check status: `./k8s/status.sh`

---

**Kubernetes Deployment Status**: ✅ Ready for Production

Your ChloroMaster application is now running on Kubernetes with:

- Auto-scaling (2-10 backend, 3-15 frontend pods)
- High availability (multiple replicas)
- Load balancing (Ingress + Services)
- Security hardening (Network policies, RBAC)
- Resource management (Quotas, Limits)
