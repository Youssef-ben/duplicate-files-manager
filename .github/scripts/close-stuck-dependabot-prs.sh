#!/usr/bin/env bash
# Close open Dependabot PRs targeting BASE whose required CI checks failed/cancelled.
# Usage: close-stuck-dependabot-prs.sh <base-branch> <close-comment>
set -euo pipefail

BASE="${1:?base branch required}"
COMMENT="${2:?close comment required}"
# Must match job `name:` values in ci.yml
REQUIRED_CHECKS='["Lint & Typecheck","Build"]'

for num in $(gh pr list --base "$BASE" --state open --json author,number \
  --jq '[.[] | select(.author.login == "dependabot[bot]") | .number][]'); do
  # Use standalone jq — gh --jq does not support --arg/--argjson.
  CHECKS=$(gh pr checks "$num" --json name,bucket || true)
  if [ -z "$CHECKS" ]; then
    STATE=pending
  else
    STATE=$(printf '%s' "$CHECKS" | jq -r --argjson required "$REQUIRED_CHECKS" '
      map(select(.name as $n | $required | index($n))) as $found
      | if ($found | length) == 0 then "pending"
        elif any($found[]; .bucket == "fail" or .bucket == "cancel") then "fail"
        elif any($found[]; .bucket == "pending") then "pending"
        elif all($found[]; .bucket == "pass" or .bucket == "skipping") then "pass"
        else "pending"
        end
    ' || echo pending)
  fi

  case "${STATE:-pending}" in
    fail)
      echo "Closing stuck Dependabot PR #$num (checks $STATE)"
      gh pr close "$num" --comment "$COMMENT" || true
      ;;
  esac
done
