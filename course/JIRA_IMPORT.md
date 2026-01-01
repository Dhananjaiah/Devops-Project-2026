# Jira Import Guide (CSV)

This repo includes a Jira-importable backlog CSV for the 6-sprint course plan.

## File
- Backlog CSV: [jira/COURSE_JIRA_BACKLOG.csv](../jira/COURSE_JIRA_BACKLOG.csv)

## Recommended Jira Fields
Map these columns during import:
- `Issue Type` → Issue Type
- `Summary` → Summary
- `Description` → Description
- `Epic Name` → Epic Name (only used for rows where Issue Type=Epic)
- `Epic Link` → Epic Link (used to attach Stories/Tasks to Epics)
- `Sprint` → Sprint (requires Jira Software + sprints created in advance)
- `Story Points` → Story Points
- `Components` → Component/s
- `Labels` → Labels

## Import Steps
1. Create the 6 sprints in your Jira board: Sprint 1 … Sprint 6 (2 weeks each).
2. Go to Jira → System → External System Import → CSV (or Project Settings import if available).
3. Upload the CSV and map fields as above.
4. Validate that:
   - Epics are created first.
   - Stories/Tasks link to Epics via `Epic Link`.
   - Story points appear on Stories.

## Notes
- If your Jira instance uses different field names (e.g., `Story Points` custom field), adjust mapping during import.
- If Sprint mapping is unavailable in import, import without Sprint first, then bulk-edit Sprint assignment.
