.PHONY: help build up down restart logs clean prune status health

# ==========================================
# ChloroMaster Docker Management
# ==========================================

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)ChloroMaster Docker Management$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build --parallel --no-cache
	@echo "$(GREEN)✓ Build complete!$(NC)"

up: ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services started!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:80$(NC)"

down: ## Stop all services
	@echo "$(BLUE)Stopping services...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services stopped!$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Services restarted!$(NC)"

logs: ## Show logs from all services
	docker-compose logs -f --tail=100

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-nginx: ## Show nginx logs
	docker-compose logs -f nginx

status: ## Show status of all services
	@echo "$(BLUE)Service Status:$(NC)"
	docker-compose ps

health: ## Check health of all services
	@echo "$(BLUE)Health Check:$(NC)"
	@docker inspect --format='{{.Name}}: {{.State.Health.Status}}' chloromaster-frontend chloromaster-nginx 2>/dev/null || echo "$(RED)Services not running$(NC)"

clean: down ## Stop services and remove containers
	@echo "$(BLUE)Cleaning up...$(NC)"
	docker-compose down -v --remove-orphans
	@echo "$(GREEN)✓ Cleanup complete!$(NC)"

prune: clean ## Remove all unused Docker resources
	@echo "$(BLUE)Pruning Docker resources...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)✓ Prune complete!$(NC)"

rebuild: clean build up ## Clean, rebuild and start services
	@echo "$(GREEN)✓ Rebuild complete!$(NC)"

shell-frontend: ## Access frontend container shell
	docker exec -it chloromaster-frontend sh

shell-nginx: ## Access nginx container shell
	docker exec -it chloromaster-nginx sh

install: ## Install and start everything
	@echo "$(BLUE)Installing ChloroMaster...$(NC)"
	@make build
	@make up
	@sleep 5
	@make health
	@echo "$(GREEN)✓ Installation complete!$(NC)"
	@echo "$(YELLOW)Access the website at: http://localhost$(NC)"

prod: ## Production deployment
	@echo "$(BLUE)Deploying to production...$(NC)"
	NODE_ENV=production docker-compose -f docker-compose.yml up -d --build
	@echo "$(GREEN)✓ Production deployment complete!$(NC)"
