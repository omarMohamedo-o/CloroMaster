# Makefile for Kubernetes Operations

.PHONY: help deploy status logs scale update cleanup

NAMESPACE := chloromaster

help: ## Show this help message
	@echo "ChloroMaster Kubernetes Management"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

build: ## Build Docker images
	@echo "Building Docker images..."
	@docker-compose build

deploy: build ## Deploy to Kubernetes
	@echo "Deploying to Kubernetes..."
	@./k8s/deploy.sh

status: ## Show cluster status
	@./k8s/status.sh

logs-backend: ## Show backend logs
	@kubectl logs -f deployment/backend -n $(NAMESPACE)

logs-frontend: ## Show frontend logs
	@kubectl logs -f deployment/frontend -n $(NAMESPACE)

logs: ## Show all logs
	@kubectl logs -f -l tier=api -n $(NAMESPACE) &
	@kubectl logs -f -l tier=web -n $(NAMESPACE)

scale-up: ## Scale up (backend: 5, frontend: 10)
	@./k8s/scale.sh backend 5
	@./k8s/scale.sh frontend 10

scale-down: ## Scale down (backend: 2, frontend: 3)
	@./k8s/scale.sh backend 2
	@./k8s/scale.sh frontend 3

update: build ## Rolling update
	@./k8s/update.sh

rollback-backend: ## Rollback backend deployment
	@kubectl rollout undo deployment/backend -n $(NAMESPACE)

rollback-frontend: ## Rollback frontend deployment
	@kubectl rollout undo deployment/frontend -n $(NAMESPACE)

restart-backend: ## Restart backend pods
	@kubectl rollout restart deployment/backend -n $(NAMESPACE)

restart-frontend: ## Restart frontend pods
	@kubectl rollout restart deployment/frontend -n $(NAMESPACE)

shell-backend: ## Get shell in backend pod
	@kubectl exec -it deployment/backend -n $(NAMESPACE) -- /bin/bash

shell-frontend: ## Get shell in frontend pod
	@kubectl exec -it deployment/frontend -n $(NAMESPACE) -- /bin/sh

port-forward: ## Port forward services (frontend:3000, backend:5000)
	@echo "Forwarding frontend to localhost:3000..."
	@kubectl port-forward -n $(NAMESPACE) svc/frontend-service 3000:3000 &
	@echo "Forwarding backend to localhost:5000..."
	@kubectl port-forward -n $(NAMESPACE) svc/backend-service 5000:5000 &
	@echo "Services available at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:5000"

hpa: ## Show HPA status
	@kubectl get hpa -n $(NAMESPACE)
	@echo ""
	@kubectl top pods -n $(NAMESPACE) 2>/dev/null || echo "Metrics server not available"

events: ## Show recent events
	@kubectl get events -n $(NAMESPACE) --sort-by='.lastTimestamp' | tail -20

describe-backend: ## Describe backend deployment
	@kubectl describe deployment/backend -n $(NAMESPACE)

describe-frontend: ## Describe frontend deployment
	@kubectl describe deployment/frontend -n $(NAMESPACE)

cleanup: ## Delete all resources
	@./k8s/cleanup.sh

# Monitoring
top: ## Show resource usage
	@watch -n 2 kubectl top pods -n $(NAMESPACE)

dashboard: ## Open Kubernetes dashboard
	@kubectl proxy &
	@echo "Dashboard available at:"
	@echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"

# Development helpers
dev-start: ## Start minikube cluster
	@minikube start --cpus=4 --memory=8192
	@minikube addons enable ingress
	@minikube addons enable metrics-server

dev-stop: ## Stop minikube cluster
	@minikube stop

dev-delete: ## Delete minikube cluster
	@minikube delete

# Database operations
db-backup: ## Backup database
	@mkdir -p backups
	@POD=$$(kubectl get pod -n $(NAMESPACE) -l app=backend -o jsonpath="{.items[0].metadata.name}") && \
	kubectl cp $(NAMESPACE)/$$POD:/app/data/chloromaster.db ./backups/chloromaster-$$(date +%Y%m%d-%H%M%S).db
	@echo "Database backed up to ./backups/"

db-restore: ## Restore database (usage: make db-restore FILE=backup.db)
	@if [ -z "$(FILE)" ]; then echo "Usage: make db-restore FILE=backup.db"; exit 1; fi
	@POD=$$(kubectl get pod -n $(NAMESPACE) -l app=backend -o jsonpath="{.items[0].metadata.name}") && \
	kubectl cp $(FILE) $(NAMESPACE)/$$POD:/app/data/chloromaster.db
	@echo "Database restored from $(FILE)"

# Testing
load-test-frontend: ## Load test frontend
	@hey -z 2m -c 50 -q 10 http://localhost:3000

load-test-backend: ## Load test backend
	@hey -z 2m -c 30 -q 5 http://localhost:5000/api/services

# Clean up
clean: ## Clean local Docker images
	@docker system prune -af --volumes
