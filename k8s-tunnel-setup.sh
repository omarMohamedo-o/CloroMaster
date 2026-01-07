#!/bin/bash
# ChloroMaster K8s Global Access Setup Script

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ChloroMaster K8s Global Access Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Kill existing port-forwards
echo "🧹 Cleaning up existing port-forwards..."
pkill -f "kubectl port-forward" || true

# Port forward frontend to 8080
echo "📡 Setting up frontend port-forward (8080 -> 80)..."
kubectl port-forward -n chloromaster svc/frontend 8080:80 > /tmp/k8s-frontend.log 2>&1 &
FRONTEND_PID=$!

# Port forward backend to 5000
echo "📡 Setting up backend port-forward (5000 -> 5000)..."
kubectl port-forward -n chloromaster svc/backend 5000:5000 > /tmp/k8s-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for port-forwards to establish
sleep 3

# Test connections
echo "🔍 Testing local connections..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "   ✅ Frontend accessible at http://localhost:8080"
else
    echo "   ❌ Frontend not accessible"
fi

if curl -s http://localhost:5000/health > /dev/null; then
    echo "   ✅ Backend accessible at http://localhost:5000"
else
    echo "   ❌ Backend not accessible"
fi

# Setup nginx reverse proxy for port 80
echo "🔧 Setting up local nginx on port 80..."
sudo tee /tmp/chloromaster-nginx.conf > /dev/null <<'NGINX'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    upstream frontend {
        server localhost:8080;
    }

    upstream backend {
        server localhost:5000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            proxy_pass http://backend/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            proxy_pass http://backend/health;
            access_log off;
        }
    }
}
NGINX

# Check if port 80 is available
if sudo lsof -i :80 > /dev/null 2>&1; then
    echo "   ⚠️  Port 80 is in use, skipping nginx setup"
    echo "   💡 Use ports directly: Frontend (8080), Backend (5000)"
else
    sudo nginx -c /tmp/chloromaster-nginx.conf -t && \
    sudo nginx -c /tmp/chloromaster-nginx.conf
    echo "   ✅ Nginx running on port 80"
fi

# Start Cloudflare tunnel
echo "🌐 Starting Cloudflare tunnel..."
cloudflared tunnel --url http://localhost:80 > /tmp/cloudflared-k8s.log 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to start
sleep 5

# Extract tunnel URL
TUNNEL_URL=$(grep -oP 'https://[^\s]+\.trycloudflare\.com' /tmp/cloudflared-k8s.log | head -1)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌍 PUBLIC URL (Global Access):"
echo "   $TUNNEL_URL"
echo ""
echo "🏠 LOCAL URLs:"
echo "   Frontend:  http://localhost:8080"
echo "   Backend:   http://localhost:5000"
echo "   Via Nginx: http://localhost:80 (if available)"
echo ""
echo "📊 SERVICES:"
echo "   MailHog:   kubectl port-forward -n chloromaster svc/mailhog 8025:8025"
echo "   Grafana:   kubectl port-forward -n chloromaster svc/grafana 3000:3000"
echo ""
echo "🔧 PROCESS IDs:"
echo "   Frontend PF: $FRONTEND_PID"
echo "   Backend PF:  $BACKEND_PID"
echo "   Tunnel:      $TUNNEL_PID"
echo ""
echo "🛑 TO STOP:"
echo "   kill $FRONTEND_PID $BACKEND_PID $TUNNEL_PID"
echo "   sudo nginx -s stop"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
