# 🚀 Mission 1: Onboarding & "The Broken Build"

**Role:** Junior DevOps Engineer (Day 1)
**Objective:** Get the legacy application running on your local machine.

---

## 1.1 The Scenario
You have just joined the team. The previous engineer left in a hurry. They left a `docker-compose.yaml` and a `Makefile`, but the CI is red and nothing seems to work out of the box.

**Your Goal:**
1.  Verify your local toolset.
2.  Bring up the stack locally.
3.  Run the "User Journey" test to prove it works.

---

## 1.2 Environment Check
First, ensure you have the required tools. We have provided a script for this.

```bash
# Run the day-0 check
./scripts/check-env.sh
```

**Requirement:** All checks must pass (Green). If any are red, install the tool before proceeding.

---

## 1.3 The "It Works on My Machine" Test
Try to spin up the application using Docker Compose.

```bash
# Build and Start
make local
```

This command does the following:
*   Builds Docker images for 4 microservices + Frontend.
*   Starts a MongoDB database.
*   Connects them on a local network.

**Verification:**
Wait about 30 seconds for containers to initialize, then check the logs:

```bash
make local-logs
# Press Ctrl+C to exit logs
```

---

## 1.4 Validate the Stack
We have an automated script that simulates a user registering, logging in, and buying a laptop.

```bash
bash scripts/demo.sh
```

**Expected Output:**
```text
PASS: End-to-end journey completed
```

If this passes, you have successfully onboarded! You now have a working local environment.

---

## 1.5 Understanding the Architecture
Before moving to the next mission, look at the architecture diagram in the root folder.
*   **Frontend**: React (Port 8080)
*   **Backend**: Node.js & Python Services (Ports 3001-3004)
*   **Database**: MongoDB (Port 27017)

---

**[NEXT MISSION] -> 02_MISSION_CONTAINERIZATION.md**
