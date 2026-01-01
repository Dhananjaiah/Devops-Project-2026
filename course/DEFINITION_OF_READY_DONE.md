# Definition of Ready (DoR) + Definition of Done (DoD)

These are course-friendly and real-world aligned. Put these into Jira as team agreements.

## Definition of Ready (Story can enter a Sprint)
- Clear **Story** with business value (who/what/why)
- Acceptance Criteria (AC) are testable (at least 3 bullets)
- Dependencies identified (services, infra, credentials, environments)
- Estimation agreed (story points)
- Demo expectation stated (what will be shown in Sprint Review)

## Definition of Done (Story is complete)
- Functional behavior meets Acceptance Criteria
- Build is reproducible:
  - Local: documented commands run cleanly
  - CI: pipeline reflects reality (no default “skip” masking failures)
- Tests:
  - At least one repeatable verification exists (script, curl flow, UI flow)
  - Regression risk assessed (add/adjust tests if appropriate)
- Security basics:
  - No secrets committed
  - Config via env/secrets
  - Input validation and safe error handling maintained
- Documentation updated:
  - Quickstart/runbook reflects current behavior
  - Any new endpoints/env vars documented
- Demo-ready:
  - Can be demonstrated in <10 minutes
  - Logs/metrics points available if relevant

## Sprint-level Done
- Sprint Goal met
- All committed stories either Done or explicitly carried over (with notes)
- Sprint Review demo recorded (notes or screenshots)
- Retro action items captured (1–3 concrete improvements)
