# Kubernetes Deployment for ChloroMaster

This folder contains Kubernetes manifests for deploying ChloroMaster.

Quick production checklist

- Install and configure cert-manager (for TLS), and create a ClusterIssuer named `letsencrypt-prod`.
- Create a namespace `chloromaster` or apply `00-namespace.yaml`.
- Provide secrets for production in `02-secrets.yaml` or create them with `kubectl create secret generic`.
  - Important keys: `Smtp__Host`, `Smtp__Port`, `Smtp__Username`, `Smtp__Password`, `Smtp__UseSsl`, `Smtp__FromEmail`, `Smtp__AdminEmail`, `CONNECTION_STRING`, `JWT_SECRET`, `PASSWORD_SALT`.
- Make sure PersistentVolumes are available for PVCs defined in `03-pvc.yaml` or adapt to your cloud provider storage classes.
- Review resource quotas in `11-resource-limits.yaml` and adjust to cluster capacity.
- Apply manifests in order:

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/03-pvc.yaml
kubectl apply -f k8s/04-backend-deployment.yaml
kubectl apply -f k8s/05-frontend-deployment.yaml
kubectl apply -f k8s/06-services.yaml
kubectl apply -f k8s/09-pdb.yaml
kubectl apply -f k8s/07-hpa-enhanced.yaml
kubectl apply -f k8s/10-network-policy.yaml
kubectl apply -f k8s/08-ingress.yaml
```

Testing and validation

- Check pods:

```bash
kubectl get pods -n chloromaster
kubectl describe pod <pod-name> -n chloromaster
kubectl logs deployment/backend -n chloromaster
```

- Verify SMTP by pointing `Smtp__Host` at a test SMTP (MailHog or provider) and triggering a datasheet request.

Notes

- For production deliverability, use a managed SMTP provider or Office365 SMTP and configure SPF/DKIM for the sending domain.
- Consider using image tags with semantic versions instead of `latest` for predictable deployments.
- If using a managed Kubernetes (EKS/GKE/AKS), adapt the PV/PVC storage class names to your provider.
