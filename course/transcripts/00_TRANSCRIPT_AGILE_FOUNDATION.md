# 🎙️ Transcript: Sprint 0 - Agile Foundation (No Code)

**Speaker:** Course Instructor
**Duration:** ~8 Minutes

---

**[00:00] Welcome**
"Welcome to the first sprint of our Production-Grade DevOps course.
But wait—we're not writing any code today.
Before we touch Docker, before we touch Kubernetes, we need to understand HOW real teams work.
And that starts with Agile."

**[00:30] Why Agile Matters for DevOps**
"In the real world, you don't just 'build stuff'. You work in sprints. You have standups. You have retrospectives.
If you've never used Jira or managed a backlog, you will struggle in any DevOps interview.
So today, we're setting up our project the way a real company would."

---

**[01:00] Step 1: Create a Jira Account**
"Go to atlassian.com/software/jira/free and create a free account.
I'll give you a moment to do that now."

*(Action: Show browser, navigate to Jira signup)*

"Once you're in, click 'Create Project'. Select the 'Scrum' template. Name it 'ShopFast DevOps' or something similar."

---

**[02:30] Step 2: Understanding the Backlog**
"Open the file `docs/BACKLOG.md` in our repository.
This is our Product Backlog. It contains 6 Epics, one for each sprint."

*(Action: Show BACKLOG.md in VS Code)*

"An EPIC is a large body of work. For example, 'Epic 1: Local Development Environment'.
Under each Epic, we have User Stories. Each story has:
- An ID (like S1.1)
- A description in the 'As a... I want... So that...' format
- Acceptance Criteria
- Story Points"

---

**[04:00] Step 3: Create Epics in Jira**
"Now, let's transfer this to Jira.
In your Jira board, click 'Create Epic'."

*(Action: Create Epic in Jira UI)*

"Name: 'Local Development Environment'
Description: Copy from BACKLOG.md
Repeat for all 6 Epics."

---

**[05:30] Step 4: Create Stories under Epics**
"Now click on an Epic, and add Stories.
For S1.1, the story is:
'As a developer, I want a single command to start all services.'
Acceptance Criteria: 'make local starts everything'
Story Points: 3"

*(Action: Create story in Jira with all fields)*

"Do this for ALL stories in Sprint 1's Epic. You don't need to create Sprint 2-6 stories yet."

---

**[06:30] Step 5: Sprint Planning**
"Now go to the Backlog view. Drag the Sprint 1 stories into the Sprint.
This is called Sprint Planning.
We're committing to delivering these stories in the next 2 weeks."

*(Action: Drag stories into Sprint in Jira)*

---

**[07:00] Step 6: Definition of Done**
"Before we close, let's talk about 'Definition of Done'.
Open `docs/DEFINITION_OF_DONE.md`.
This is our team contract. A story is NOT done until:
- Code is merged to main
- Tests pass
- Documentation is updated
- It can be demoed

This prevents 'it works on my machine' arguments."

---

**[08:00] Wrap Up**
"You've now completed Sprint 0.
You have a Jira board with Epics and Stories.
You understand Agile ceremonies.
You know what 'Done' means.

In the next sprint, we'll finally write some code.
Commit your repo and I'll see you in Sprint 1."

*(Action: `git add . && git commit -m "Sprint 0: Agile Foundation"`)*
