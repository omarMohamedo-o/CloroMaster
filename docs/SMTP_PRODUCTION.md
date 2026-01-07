Purpose

- Describe how to configure a hosted SMTP (SendGrid/AWS SES) for production k8s and how to test it.

Quick steps (SendGrid example)

1. Create a SendGrid API Key with "Full Access" for Mail Send (or scoped minimal permissions).
2. Store values in a Kubernetes secret (do NOT commit API keys to the repo):

```bash
kubectl create secret generic production-smtp-secret \
  --namespace chloromaster \
  --from-literal=Smtp__Host=smtp.sendgrid.net \
  --from-literal=Smtp__Port=587 \
  --from-literal=Smtp__Username=apikey \
  --from-literal=Smtp__Password='<SENDGRID_API_KEY>' \
  --from-literal=Smtp__UseSsl=true \
  --from-literal=Smtp__FromName='ChloroMaster' \
  --from-literal=Smtp__FromEmail='chloromaster365@gmail.com' \
  --from-literal=Smtp__AdminEmail='chloromaster365@gmail.com'
```

1. Update `k8s/04-backend-deployment.yaml` (or your environment overlay) to reference `production-smtp-secret` instead of `chloromaster-secrets`.
   - You can either update `envFrom` or create a `production` overlay that points to the new secret.

2. Set `ALLOW_DATASHEET_WITHOUT_EMAIL=false` for production (remove the dev fallback).

```bash
kubectl -n chloromaster set env deployment/backend ALLOW_DATASHEET_WITHOUT_EMAIL=false
```

1. Restart the backend deployment:

```bash
kubectl rollout restart deployment/backend -n chloromaster
kubectl rollout status deployment/backend -n chloromaster
```

1. Test sending an email from inside the cluster (this uses the backend's API to trigger an email send):

```bash
kubectl run smtp-test --image=curlimages/curl:latest -n chloromaster --rm -it --restart=Never -- \
  sh -c 'printf "%s" "{\"fullName\":\"Prod Test\",\"email\":\"you@yourdomain.com\",\"phone\":\"000\",\"company\":\"Test\",\"datasheetSlug\":\"chlorine-system-solutions\"}" | curl -s -w "\\nHTTP Status: %{http_code}\\n" -X POST http://backend:5000/api/datasheet/request -H "Content-Type: application/json" -d @-'
```

1. Check SendGrid dashboard / email inbox to confirm delivery.

Notes & Troubleshooting

- If sending still fails in k8s:
  - Check backend logs: `kubectl logs -n chloromaster deployment/backend --tail=200`.
  - Confirm secret values are correct: `kubectl get secret production-smtp-secret -n chloromaster -o yaml` (do not paste secrets in chat).
  - If DNS issues persist, try setting the SMTP host to its resolved IP temporarily (not recommended long-term) and ensure the `Smtp__Host` secret contains the IP.

Rollback plan

- If production SMTP problems block user flows, set `ALLOW_DATASHEET_WITHOUT_EMAIL=true` temporarily until you fix SMTP.

Security

- Never commit API keys to version control. Use your cloud provider's secret manager or sealed-secrets/ExternalSecret operator for production.
