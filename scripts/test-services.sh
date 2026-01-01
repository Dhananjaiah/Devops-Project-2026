#!/usr/bin/env bash
set -euo pipefail

# CI/local smoke test script.
# Uses the same flow as scripts/demo.sh but leaves services alone.

KEEP_RUNNING=1 bash "$(dirname "$0")/demo.sh"
