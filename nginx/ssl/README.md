DO NOT commit private TLS keys or origin certificates into source control.

Place your Cloudflare Origin Certificate and Private Key here as:

- `cf-origin.crt`  (PEM, origin certificate)
- `cf-origin.key`  (PEM, private key)

Set permissions after adding them:

```bash
chmod 600 nginx/ssl/*
```

Use the `./scripts/install_cloudflare_origin_cert.sh` helper to copy certs to the server during deployment instead of committing them.
