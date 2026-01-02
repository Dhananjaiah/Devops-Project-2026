# 🎙️ Transcript: Mission 1 - The Broken Build (Onboarding)

**Speaker:** Course Instructor
**Duration:** ~5 Minutes

---

**[00:00] Intro**
"Hello and welcome to Day 1 at the generic E-Commerce Startup.
I'm your lead URL, and I have some bad news. The previous DevOps engineer left yesterday, and they didn't leave much documentation.
We have this repository, but the build is broken. The CI is failing, and nobody knows how to run it locally.
Your mission today is simple: Get this thing running on your machine."

**[00:45] The Environment Check**
"First, let's make sure you have the right tools. We don't want to be debugging installation issues later.
Open your terminal and run the environment checker."

*(Action: Run `./scripts/check-env.sh`)*

"You should see Green Checks for Docker, Node, and Python. If you see Red, pause this video and install them."

**[01:30] The "Make Local" Command**
"Now, look at the `Makefile`. It's a map of all the commands we can run.
There is a target called `local`. Let's see what it does. It uses Docker Compose to spin up our 4 microservices and a database.
Let's run it."

*(Action: Run `make local`)*

"You'll see Docker building the images... creating the network... and attaching the containers.
This might take a minute the first time."

**[02:30] Inspecting Logs**
"It looks like it started, but is it actually working? Let's check the logs."

*(Action: Run `make local-logs`)*

"You see that? 'Connected to MongoDB'. That is what we want to see. If the database wasn't running, this would be crashing constantly.
Hit `Ctrl+C` to exit the logs. The app is still running in the background."

**[03:15] The Proof (Demo Script)**
"Now for the moment of truth. We need to prove to the manager that the app works.
We have a script called `demo.sh`. It acts like a User: it registers, logs in, adds a laptop to the cart, and buys it."

*(Action: Run `bash scripts/demo.sh`)*

"Watch the output... Register... Login... Order Created... PASS.
Boom! You did it. You have a working local environment."

**[04:00] Cleanup**
"Great job. You've officially onboarded.
Before we go to the next mission, let's clean up so we don't eat up all your RAM."

*(Action: Run `make local-down`)*

"In the next mission, we're going to take these local images and verify them for the Cloud. I'll see you there."
