# GitOps with ArgoCD

This directory contains the "App of Apps" pattern for deploying the entire e-commerce stack.

## Pre-requisites
1.  Kubernetes Cluster (Minikube or EKS)
2.  ArgoCD installed:
    ```bash
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    ```

## Deploying the Stack
1.  Update the `repoURL` in `k8s/argocd/root-app.yaml` and `k8s/argocd/applications/*.yaml` to point to your forked repository.
2.  Apply the root application:
    ```bash
    kubectl apply -f k8s/argocd/root-app.yaml
    ```
3.  Sync via UI or Wait: ArgoCD will pick up the child apps (services, databases, config) and deploy them.

## Directory Structure
*   `root-app.yaml`: The parent application that watches the `applications/` folder.
*   `applications/`: Contains definitions for logical groups of resources (Microservices, DBs, Config).
