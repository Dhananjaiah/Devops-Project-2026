.PHONY: help build push deploy clean test

help:
	@echo "Available commands:"
	@echo "  make build        - Build all Docker images"
	@echo "  make push         - Push images to ECR"
	@echo "  make deploy       - Deploy to EKS"
	@echo "  make local        - Run locally with docker-compose"
	@echo "  make clean        - Clean up resources"
	@echo "  make test         - Test the services"

build:
	@echo "Building Docker images..."
	docker build -t product-service:latest ./microservices/product-service
	docker build -t user-service:latest ./microservices/user-service
	docker build -t cart-service:latest ./microservices/cart-service
	docker build -t order-service:latest ./microservices/order-service

local:
	@echo "Starting services locally..."
	docker-compose up -d

local-down:
	@echo "Stopping local services..."
	docker-compose down

local-logs:
	docker-compose logs -f

push:
	@echo "Pushing images to ECR..."
	@echo "Make sure to set AWS_ACCOUNT_ID and AWS_REGION"
	./scripts/push-to-ecr.sh

deploy:
	@echo "Deploying to EKS..."
	kubectl apply -f k8s/namespaces/
	kubectl apply -f k8s/rbac/
	kubectl apply -f k8s/databases/
	kubectl apply -f k8s/configmaps/
	kubectl apply -f k8s/deployments/
	kubectl apply -f k8s/services/
	kubectl apply -f k8s/ingress/
	kubectl apply -f k8s/autoscaling/
	kubectl apply -f k8s/network-policies/
	kubectl apply -f k8s/backup/

status:
	@echo "Checking deployment status..."
	kubectl get all -n ecommerce

logs:
	@echo "Viewing logs..."
	kubectl logs -f -l app=product-service -n ecommerce

clean:
	@echo "Cleaning up Kubernetes resources..."
	kubectl delete namespace ecommerce

test:
	@echo "Testing services..."
	./scripts/test-services.sh
