# Agile Sprint Quick Reference Guide

## Overview
This guide provides a quick reference for executing Agile sprints for the E-Commerce Microservices project.

---

## Sprint Cycle (2 Weeks / 10 Working Days)

### Week 1
```
Day 1: Sprint Planning (2 hours)
Day 2-5: Development & Daily Standups (15 min each)
Day 5: Mid-sprint checkpoint
```

### Week 2
```
Day 6-9: Development & Daily Standups (15 min each)
Day 9: Prep for Sprint Review
Day 10: Sprint Review (1 hour) + Retrospective (1 hour)
```

---

## Daily Schedule

### Daily Standup (15 minutes)
**Time**: 9:00 AM (adjust as needed)  
**Format**: Each person answers:
1. What did I complete yesterday?
2. What will I work on today?
3. Any blockers?

**Rules**:
- Keep it to 15 minutes
- Stay standing (virtual: cameras on)
- Focus on progress, not problem-solving
- Take detailed discussions offline

---

## Sprint Ceremonies

### 1. Sprint Planning (Day 1 - 2 hours)

**Agenda**:
1. Review sprint goal (15 min)
2. Review and refine backlog items (30 min)
3. Team estimates stories (30 min)
4. Team commits to stories (15 min)
5. Break stories into tasks (30 min)

**Output**:
- Sprint goal defined
- Sprint backlog created
- Tasks assigned
- Team commitment

**Preparation**:
- Product Owner prepares prioritized backlog
- Team reviews stories beforehand
- Previous sprint reviewed

---

### 2. Daily Standup (Daily - 15 minutes)

**Format**:
```
Team Member 1:
- Yesterday: Completed US-2.1 tasks 1-3
- Today: Working on US-2.1 task 4
- Blockers: Need AWS credentials

Team Member 2:
- Yesterday: Fixed bug in cart service
- Today: Starting US-2.3
- Blockers: None

[Continue for all team members]
```

**Scrum Master Actions**:
- Note blockers
- Schedule follow-ups
- Update sprint board
- Track attendance

---

### 3. Sprint Review (Day 10 - 1 hour)

**Agenda**:
1. Review sprint goal (5 min)
2. Demo completed work (40 min)
3. Stakeholder feedback (10 min)
4. Accept/reject stories (5 min)

**Demo Format**:
```
Story US-X.Y: [Title]
- Business value: [Why it matters]
- Demo: [Show working feature]
- Acceptance: [Criteria met]
- Feedback: [Stakeholder input]
```

**Participants**:
- Development Team
- Product Owner
- Scrum Master
- Stakeholders
- Management (optional)

---

### 4. Sprint Retrospective (Day 10 - 1 hour)

**Agenda**:
1. Set the stage (5 min)
2. Gather data (15 min)
3. Generate insights (20 min)
4. Decide what to do (15 min)
5. Close retrospective (5 min)

**Format** (Start-Stop-Continue):
```
START (What should we start doing?)
- Action 1
- Action 2

STOP (What should we stop doing?)
- Action 1
- Action 2

CONTINUE (What should we keep doing?)
- Action 1
- Action 2
```

**Output**:
- Action items with owners
- Improvements for next sprint
- Team morale assessment

---

## Story Point Estimation

### Planning Poker Scale
```
1 SP   = Few hours (XS)
2 SP   = Half day (S)
3 SP   = 1 day (S-M)
5 SP   = 2-3 days (M)
8 SP   = 1 week (L)
13 SP  = 2 weeks (XL)
21+ SP = Too large, break it down
```

### Estimation Guidelines
- Compare to reference stories
- Consider complexity, effort, and risk
- Include testing and documentation time
- Account for unknowns
- When in doubt, estimate higher

---

## Definition of Done (DoD)

### For a Story to be "Done":
- [ ] Code written and follows style guide
- [ ] Unit tests written with >80% coverage
- [ ] Code reviewed and approved by 1+ team member
- [ ] Integration tests passing
- [ ] Documentation updated (API docs, README, etc.)
- [ ] Deployed to staging environment
- [ ] All acceptance criteria met
- [ ] No critical or high-severity bugs
- [ ] Security scan passed
- [ ] Demo ready for Sprint Review

---

## Sprint Board Workflow

### Columns
```
📋 Backlog → 🔜 Todo → 🔄 In Progress → 👀 Review → ✅ Done
```

### Story States
- **Backlog**: Not yet committed
- **Todo**: Committed for sprint, not started
- **In Progress**: Actively being worked on
- **Review**: Code review / QA testing
- **Done**: Meets DoD, accepted by PO

### Daily Updates
- Move cards as work progresses
- Update story point burndown
- Flag blockers with red labels
- Add comments with updates

---

## Common Agile Artifacts

### 1. Sprint Backlog
Location: `.github/sprints/sprint-N.md`

### 2. Product Backlog
Location: `BACKLOG.md`

### 3. Sprint Planning Document
Location: `SPRINTS.md`

### 4. Burndown Chart
Track in: Sprint file (Day-by-day)

### 5. Velocity Chart
Track in: SPRINTS.md (Sprint metrics table)

---

## Communication Guidelines

### Slack/Teams Channels
- `#daily-standup` - Daily standup notes
- `#sprint-planning` - Sprint planning discussions
- `#blockers` - Urgent blocker resolution
- `#general` - General team communication

### Meeting Notes
- Document all decisions
- Share action items
- Update within 2 hours of meeting
- Archive in `.github/sprints/`

### Status Updates
- **Daily**: Standup updates
- **Weekly**: Sprint progress report
- **Bi-weekly**: Sprint review summary
- **Monthly**: Project status report

---

## Sprint Metrics to Track

### Velocity
```
Sprint Velocity = Total Story Points Completed
Average Velocity = Sum of last 3 sprints / 3
```

### Burndown
```
Track remaining story points each day
Ideal: Linear decrease to zero
```

### Quality Metrics
- Test coverage percentage
- Bug count (opened vs closed)
- Code review turnaround time
- Deployment frequency

### Team Health
- Sprint commitment met (%)
- Blocker resolution time
- Team satisfaction (1-5 scale)
- Retrospective action completion

---

## Handling Common Scenarios

### Scenario 1: Story Won't Finish This Sprint
**Action**:
1. Assess remaining work
2. Can it be done in 1-2 days? Push to finish
3. If no, split story or move to next sprint
4. Update sprint board and communicate to PO

### Scenario 2: Critical Bug Found
**Action**:
1. Assess severity (P0/P1/P2/P3)
2. If P0/P1, pull team member to fix immediately
3. Re-prioritize sprint backlog
4. Communicate impact to PO
5. May need to drop a story from sprint

### Scenario 3: Story Completed Early
**Action**:
1. Move story to Done
2. Help teammates with their stories
3. If team ahead, pull next priority item from backlog
4. Don't start new epics unless PO approves

### Scenario 4: Blocker Can't Be Resolved
**Action**:
1. Escalate to Scrum Master
2. Document blocker details
3. Find alternative work
4. May need emergency stakeholder meeting
5. Adjust sprint scope if needed

### Scenario 5: Team Member Absent
**Action**:
1. Redistribute their work
2. Update sprint board
3. Communicate to team in standup
4. Adjust sprint commitment if needed
5. Have handoff when they return

---

## Sprint Health Indicators

### 🟢 Healthy Sprint
- Burndown tracking ideally
- All stories progressing
- No major blockers
- Team morale high
- On track to meet commitment

### 🟡 At-Risk Sprint
- Burndown slightly behind
- 1-2 stories stalled
- Minor blockers present
- May need to adjust scope
- Team working longer hours

### 🔴 Troubled Sprint
- Burndown significantly behind
- Multiple stories blocked
- Major technical issues
- Team morale low
- Sprint goal at risk

**Action for 🟡/🔴**: Emergency team sync, re-plan, escalate

---

## Quick Commands

### View Sprint Status
```bash
cat .github/sprints/sprint-N.md
```

### Update Story Status
Edit sprint file and update checkboxes:
```markdown
- [x] Completed task
- [ ] Pending task
```

### Check Velocity
```bash
grep -A 3 "Velocity" SPRINTS.md
```

---

## Resources

- **Sprint Files**: `.github/sprints/sprint-N.md`
- **Backlog**: `BACKLOG.md`
- **Sprint Planning**: `SPRINTS.md`
- **Template**: `.github/sprints/sprint-template.md`

---

## Quick Tips

1. **Keep sprints consistent** - Same duration, same ceremonies
2. **Don't change sprint scope mid-sprint** - Unless absolutely necessary
3. **Finish stories before starting new ones** - Limit WIP
4. **Update board daily** - Transparency is key
5. **Celebrate wins** - Recognize team achievements
6. **Learn from retrospectives** - Act on action items
7. **Keep DoD strict** - Quality over quantity
8. **Protect the team** - Scrum Master shields from interruptions
9. **Collaborate** - Pair programming, code reviews, knowledge sharing
10. **Trust the process** - Agile works when followed consistently

---

## Need Help?

- **Scrum Master**: [Contact info]
- **Product Owner**: [Contact info]
- **Agile Coach**: [Contact info]

For questions about this guide, see `SPRINTS.md` for detailed information.
