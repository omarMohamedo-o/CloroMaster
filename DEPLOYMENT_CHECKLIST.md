# Deployment Checklist

Complete checklist for deploying ChloroMaster to production Kubernetes cluster.

## 📋 Pre-Deployment

### Infrastructure

- [ ] Kubernetes cluster v1.24+ provisioned
- [ ] kubectl configured with cluster access
- [ ] Metrics Server installed (for HPA)

  ```bash
  kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
  ```

- [ ] Nginx Ingress Controller installed

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
  ```

- [ ] Storage class available (for PVCs)

  ```bash
  kubectl get storageclass
  ```

- [ ] Sufficient cluster resources:
  - [ ] Min 4 CPU cores available
  - [ ] Min 8Gi memory available
  - [ ] Min 10Gi storage available

### Container Registry

- [ ] Docker registry accessible (Docker Hub, ECR, GCR, ACR)
- [ ] Registry credentials configured

  ```bash
  docker login <your-registry>
  ```

- [ ] Kubernetes pull secret created (if private registry)

  ```bash
  kubectl create secret docker-registry regcred \
    --docker-server=<your-registry> \
    --docker-username=<username> \
    --docker-password=<password> \
    -n chloromaster
  ```

### DNS & TLS

- [ ] Domain name registered (e.g., chloromaster.com)
- [ ] DNS provider access (for A/CNAME records)
- [ ] (Optional) cert-manager installed for TLS

  ```bash
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
  ```

---

## 🔨 Build & Push Images

### Frontend

```bash
cd frontend

# Build image
docker build -t <your-registry>/chloromaster-frontend:v1.0.0 .

# Test locally
docker run -p 3000:80 <your-registry>/chloromaster-frontend:v1.0.0

# Push to registry
docker push <your-registry>/chloromaster-frontend:v1.0.0
```

- [ ] Frontend image built successfully
- [ ] Frontend image tested locally
- [ ] Frontend image pushed to registry
- [ ] Image size reasonable (~40MB)

### Backend

```bash
cd backend

# Build image
docker build -t <your-registry>/chloromaster-backend:v1.0.0 .

# Test locally
docker run -p 5000:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -v $(pwd)/test-data:/data \
  <your-registry>/chloromaster-backend:v1.0.0

# Push to registry
docker push <your-registry>/chloromaster-backend:v1.0.0
```

- [ ] Backend image built successfully
- [ ] Backend image tested locally
- [ ] Backend image pushed to registry
- [ ] Image size reasonable (~220MB)
- [ ] Migration scripts included in image
- [ ] Seed scripts included in image

---

## 🔐 Security Configuration

### Secrets

Edit `k8s/02-secrets.yaml`:

```bash
# Generate secure JWT key (256-bit)
openssl rand -base64 32

# Base64 encode for Kubernetes
echo -n "your-jwt-key-here" | base64
```

- [ ] JWT secret key generated (32+ characters)
- [ ] JWT secret key base64 encoded
- [ ] JWT secret key updated in `k8s/02-secrets.yaml`
- [ ] Database password changed from default
- [ ] Database password base64 encoded
- [ ] Secrets file not committed to Git (in .gitignore)

### Admin Credentials

- [ ] Default admin password documented: `Admin@123`
- [ ] Plan to change password after first login
- [ ] Password policy enforced in application

### Network Security

Review `k8s/10-network-policy.yaml`:

- [ ] Network policies reviewed
- [ ] Ingress rules appropriate for your setup
- [ ] Egress rules allow necessary external connections
- [ ] DNS resolution allowed (kube-dns)

---

## ⚙️ Configuration Updates

### ConfigMap

Edit `k8s/01-configmap.yaml`:

```yaml
data:
  # Backend config
  ASPNETCORE_ENVIRONMENT: "Production"  # Change from Development
  DATABASE_PATH: "/data/chloromaster.db"
  LOG_LEVEL: "Information"  # Or "Warning" for production
  
  # Frontend config
  REACT_APP_API_URL: "https://chloromaster.com/api"  # Update domain
```

- [ ] Environment set to "Production"
- [ ] API URL updated to production domain
- [ ] Log level appropriate (Information or Warning)
- [ ] Database path correct (/data/chloromaster.db)

### Deployments

Update image references in:

- `k8s/04-backend-deployment.yaml`
- `k8s/05-frontend-deployment.yaml`

```yaml
spec:
  template:
    spec:
      containers:
      - name: backend
        image: <your-registry>/chloromaster-backend:v1.0.0  # Update
```

- [ ] Backend image reference updated
- [ ] Frontend image reference updated
- [ ] Image pull policy set (IfNotPresent or Always)
- [ ] (If private registry) imagePullSecrets added:

  ```yaml
  imagePullSecrets:
  - name: regcred
  ```

### Ingress

Edit `k8s/08-ingress.yaml`:

```yaml
spec:
  tls:
  - hosts:
    - chloromaster.com          # Update
    secretName: chloromaster-tls # Update
  rules:
  - host: chloromaster.com       # Update
```

- [ ] Host domain updated (replace chloromaster.com)
- [ ] TLS secret name updated
- [ ] (If using cert-manager) annotations added:

  ```yaml
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  ```

### Resource Limits

Review `k8s/04-backend-deployment.yaml` and `k8s/05-frontend-deployment.yaml`:

- [ ] Resource requests appropriate for cluster
- [ ] Resource limits set correctly
- [ ] Requests match HPA requirements
- [ ] Cluster has sufficient resources for max replicas

---

## 🚀 Deployment

### Deploy to Kubernetes

```bash
# 1. Make scripts executable (if not already)
chmod +x k8s/*.sh

# 2. Review configurations one last time
cat k8s/02-secrets.yaml  # Ensure secrets are updated
cat k8s/08-ingress.yaml  # Ensure domain is correct

# 3. Deploy
./k8s/deploy.sh
```

- [ ] All scripts executable
- [ ] deploy.sh executed successfully
- [ ] Namespace created
- [ ] All resources created

### Verify Deployment

```bash
# Check all resources
./k8s/status.sh

# Watch pods come up
kubectl get pods -n chloromaster -w

# Check migrations
kubectl logs -n chloromaster deployment/backend -c db-migration

# Check HPA
kubectl get hpa -n chloromaster
```

- [ ] All pods in Running state
- [ ] Deployments show READY replicas (2/2 backend, 3/3 frontend)
- [ ] Migration initContainer completed successfully
- [ ] Admin user seeded (check logs)
- [ ] HPA shows current metrics (may take 1-2 min)
- [ ] Services have endpoints
- [ ] Ingress has external IP/hostname

---

## 🌐 DNS Configuration

### Get Ingress IP

```bash
kubectl get ingress -n chloromaster

# Output:
# NAME               CLASS   HOSTS              ADDRESS         PORTS
# chloromaster-ingress nginx  chloromaster.com  203.0.113.42   80, 443
```

### Configure DNS Records

- [ ] A record: `chloromaster.com` → `<INGRESS-IP>`
- [ ] (Optional) CNAME: `www.chloromaster.com` → `chloromaster.com`
- [ ] DNS propagation verified (wait 5-60 minutes)

  ```bash
  nslookup chloromaster.com
  dig chloromaster.com
  ```

---

## 🔒 TLS/SSL Configuration

### Option 1: cert-manager (Recommended)

```bash
# 1. Install cert-manager (if not done)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 2. Create ClusterIssuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# 3. Update Ingress with annotation
kubectl annotate ingress chloromaster-ingress -n chloromaster \
  cert-manager.io/cluster-issuer=letsencrypt-prod
```

- [ ] cert-manager installed
- [ ] ClusterIssuer created
- [ ] Email address updated in ClusterIssuer
- [ ] Ingress annotated for cert-manager
- [ ] Certificate issued (check with `kubectl get certificate -n chloromaster`)
- [ ] TLS secret created

### Option 2: Manual Certificate

```bash
# 1. Get certificate from CA (or self-signed for testing)
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout tls.key \
  -out tls.crt \
  -subj "/CN=chloromaster.com/O=ChloroMaster"

# 2. Create TLS secret
kubectl create secret tls chloromaster-tls \
  --cert=tls.crt \
  --key=tls.key \
  -n chloromaster
```

- [ ] Certificate obtained
- [ ] TLS secret created
- [ ] Ingress references correct secret name

---

## ✅ Post-Deployment Verification

### Application Access

- [ ] Frontend accessible: <https://chloromaster.com>
- [ ] Backend API accessible: <https://chloromaster.com/api/health>
- [ ] Admin panel accessible: <https://chloromaster.com/admin/login>
- [ ] HTTPS working (no certificate errors)
- [ ] HTTP redirects to HTTPS

### Admin Login

```bash
# Test admin login
Username: admin
Password: Admin@123
```

- [ ] Admin login page loads
- [ ] Can login with default credentials
- [ ] Dashboard/admin interface loads
- [ ] **IMPORTANT**: Change default password immediately!

### Database

```bash
# Check database
kubectl exec -it deployment/backend -n chloromaster -- \
  sqlite3 /data/chloromaster.db

.tables
SELECT * FROM __MigrationHistory;
SELECT COUNT(*) FROM AdminUsers;
.quit
```

- [ ] Database file exists (/data/chloromaster.db)
- [ ] All tables created
- [ ] All migrations applied
- [ ] Admin user exists

### Functionality Testing

- [ ] Homepage loads correctly
- [ ] Services page displays services
- [ ] About page loads
- [ ] Contact form submits successfully
- [ ] Contact form data saved to database
- [ ] Admin can view contact submissions
- [ ] All images load
- [ ] Mobile responsive design works

---

## 📊 Monitoring & Auto-scaling

### HPA Verification

```bash
# Watch HPA
watch kubectl get hpa -n chloromaster

# Expected output:
# NAME           REFERENCE         TARGETS         MINPODS MAXPODS REPLICAS
# backend-hpa    Deployment/backend  45%/70%, 60%/80%  2     10      2
# frontend-hpa   Deployment/frontend 30%/60%, 40%/70%  3     15      3
```

- [ ] HPA shows current metrics (not `<unknown>`)
- [ ] Backend HPA: 2 replicas min, 10 max
- [ ] Frontend HPA: 3 replicas min, 15 max
- [ ] CPU and Memory metrics visible

### Load Testing (Optional)

```bash
# Install hey load tester
go install github.com/rakyll/hey@latest

# Test backend auto-scaling
hey -z 5m -c 100 -q 50 https://chloromaster.com/api/services

# Watch scaling in another terminal
watch 'kubectl get hpa -n chloromaster && echo && kubectl get pods -n chloromaster'
```

- [ ] Load test completed
- [ ] HPA scaled up during load
- [ ] HPA scaled down after load
- [ ] Application remained responsive
- [ ] No pod crashes or errors

### Resource Monitoring

```bash
# Check resource usage
kubectl top pods -n chloromaster
kubectl top nodes

# Check resource quota
kubectl describe resourcequota -n chloromaster
```

- [ ] Pod resource usage reasonable (not hitting limits)
- [ ] Node resources sufficient
- [ ] Resource quota not exceeded

---

## 🔧 Troubleshooting Guide

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n chloromaster
kubectl describe pod <pod-name> -n chloromaster

# Common issues:
# - ImagePullBackOff: Check image name, registry access
# - CrashLoopBackOff: Check logs (kubectl logs <pod-name>)
# - Pending: Check resources (kubectl describe node)
```

### Migration Errors

```bash
# Check migration logs
kubectl logs deployment/backend -n chloromaster -c db-migration

# If failed:
# 1. Check SQL syntax in migration files
# 2. Check database permissions
# 3. Manual recovery: kubectl exec and sqlite3
```

### HPA Not Scaling

```bash
# Check metrics server
kubectl get apiservice v1beta1.metrics.k8s.io

# Check HPA
kubectl describe hpa backend-hpa -n chloromaster

# Common issues:
# - Metrics server not installed
# - Resource requests not set
# - Wait 1-2 minutes for metrics to populate
```

### TLS Certificate Issues

```bash
# Check certificate
kubectl get certificate -n chloromaster
kubectl describe certificate chloromaster-tls -n chloromaster

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Common issues:
# - DNS not propagated yet
# - Let's Encrypt rate limits
# - HTTP challenge blocked by firewall
```

---

## 🎉 Launch Checklist

### Pre-Launch

- [ ] All deployment steps completed
- [ ] All verification tests passed
- [ ] Load testing completed (optional)
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Team trained on management scripts
- [ ] Documentation reviewed
- [ ] Change default admin password ⚠️

### Launch

- [ ] DNS records updated
- [ ] TLS certificate validated
- [ ] Application accessible publicly
- [ ] Announce launch to team
- [ ] Monitor logs for first 30 minutes

  ```bash
  kubectl logs -f deployment/backend -n chloromaster
  kubectl logs -f deployment/frontend -n chloromaster
  ```

### Post-Launch (First 24 Hours)

- [ ] Monitor error logs
- [ ] Check HPA scaling behavior
- [ ] Verify database writes
- [ ] Test contact form submissions
- [ ] Monitor resource usage
- [ ] Check for certificate expiry warnings
- [ ] Review security logs (if configured)

### Post-Launch (First Week)

- [ ] Review auto-scaling patterns
- [ ] Adjust HPA thresholds if needed
- [ ] Optimize resource limits
- [ ] Plan database backups
- [ ] Review and address any errors
- [ ] Collect user feedback
- [ ] Plan next iteration/features

---

## 📝 Rollback Plan

If critical issues arise:

```bash
# Option 1: Rollback to previous image
kubectl set image deployment/backend \
  backend=<your-registry>/chloromaster-backend:v0.9.0 \
  -n chloromaster

# Option 2: Scale down to maintenance mode
kubectl scale deployment/backend --replicas=1 -n chloromaster
kubectl scale deployment/frontend --replicas=1 -n chloromaster

# Option 3: Complete removal
./k8s/cleanup.sh

# Then redeploy stable version
```

- [ ] Previous image versions tagged and available
- [ ] Rollback procedure tested
- [ ] Database backup available
- [ ] Team knows how to execute rollback

---

## 🎯 Success Criteria

✅ **Deployment Successful When**:

- All pods running and ready
- HPA showing metrics and scaling
- Application accessible via HTTPS
- Admin panel accessible and functional
- Database migrations applied
- No critical errors in logs
- TLS certificate valid
- Auto-scaling tested (optional)

✅ **Production Ready When**:

- All security items completed (secrets changed)
- Monitoring in place
- Backup strategy defined
- Team trained
- Documentation complete
- Rollback plan tested

---

**Ready to Launch!** 🚀

Start with: `./k8s/deploy.sh`

Then follow this checklist step by step.
