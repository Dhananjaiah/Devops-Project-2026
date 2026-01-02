# 🎓 DevOps Platform Engineering Course
## "From Localhost to Logical Production"

**Welcome to the team!**
You have just joined a fast-paced e-commerce startup. We have a basic set of microservices that "work on my machine" but fall apart in production. Your job is to take this codebase and build a robust, scalable, and automated Internal Developer Platform (IDP) on AWS.

---

## 🗺️ Your Journey (Syllabus)

This course is structured as 6 Agile Sprints (2 weeks each).

| Sprint | Phase | Mission ("The Story") | Tech Stack |
| :-- | :--- | :--- | :--- |
| **01** | **Onboarding** | "It works on my machine!" — Get the legacy code running locally and fix broken CI. | Docker Compose, Make, Github Actions |
| **02** | **Hardening** | "Production is down!" — Fix database resilience, secrets, and auth issues. | MongoDB, Python/Node, JWT |
| **03** | **Features** | "Customers need a UI" — Deploy the frontend and connect the full stack. | React, Nginx, CORS |
| **04** | **Platform** | "Deployments are too slow" — Build a local K8s platform with GitOps. | Kubernetes (Kind/Minikube), ArgoCD, Gateway API |
| **05** | **Cloud** | "Go Global" — Move everything to AWS EKS without downtime. | AWS EKS, Terraform, Helm |
| **06** | **Day 2 Ops** | "Keep the lights on" — Observability, Backups, and Security. | Prometheus, Grafana, Velero |

---

## 🚀 Getting Started (Day 0)

1.  **Clone this Repo**
    ```bash
    git clone https://github.com/your-org/devops-project-2026.git
    cd devops-project-2026
    ```

2.  **Check Your Environment**
    Run the automated checker to ensure you have the right tools installed.
    ```bash
    # Coming soon: ./scripts/check-env.sh
    # Manual check:
    docker --version
    kubectl version --client
    aws --version
    ```

3.  **Read the Sprint Plan**
    Open [SPRINTS.md](SPRINTS.md) to see your backlog.

---

## 📂 Repository Structure

*   `microservices/` - The application source code (Node.js & Python).
*   `k8s/` - Kubernetes manifests (Plain YAML).
*   `terraform/` - Infrastructure as Code for AWS.
*   `course/` - Your "Instruction Manuals" for each sprint.
*   `.github/` - CI/CD workflows and project boards.

---

## 🤝 Community & Help
*   **Issues**: Found a bug? Open a GitHub Issue.
*   **Discussion**: questions? Post in the Course Forum.

> **Instructor Note:** "Don't just copy-paste. Understand *why* it broke, then fix it."
