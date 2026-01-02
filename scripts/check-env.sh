#!/bin/bash
# Description: Checks if the user environment has the necessary tools installed.

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}DevOps Course - Environment Check${NC}"
echo "================================="

FAILED=0

check_command() {
    local cmd=$1
    local name=$2
    
    if command -v $cmd &> /dev/null; then
        echo -e "[${GREEN}OK${NC}] $name is installed ($($cmd --version 2>&1 | head -n 1))"
    else
        echo -e "[${RED}MISSING${NC}] $name is NOT installed."
        FAILED=1
    fi
}

check_command "docker" "Docker"
check_command "kubectl" "Kubernetes CLI (kubectl)"
check_command "eksctl" "EKS CLI (eksctl)"
check_command "aws" "AWS CLI"
check_command "node" "Node.js"
check_command "python3" "Python 3"
check_command "helm" "Helm"

echo "================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: All required tools are installed! You are ready to start.${NC}"
    exit 0
else
    echo -e "${RED}ERROR: Some tools are missing. Please install them before proceeding.${NC}"
    exit 1
fi
