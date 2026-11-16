#!/usr/bin/env bash
# Close open Dependabot PRs targeting BASE whose checks already failed/cancelled.
# Usage: close-stuck-dependabot-prs.sh <base-branch> <close-comment> [self-check-name]
set -euo pipefail

BASE="${1:?base branch required}"
COMMENT="${2:?close comment required}"
# Ignore this check name when judging PR health (auto-merge job on the PR itself).
SELF_CHECK="${3:-}"

for num in $(gh pr list --base "$BASE" --state open --json author,number \
  --jq '[.[] | select(.author.login == "dependabot[bot]") | .number][]'); do
  STATE=$(gh pr checks "$num" --json name,bucket \
    --jq --arg self "$SELF_CHECK" '
      [.[] | select(.name != $self) | .bucket]
      | if length == 0 then "missing"
        elif any(. == "fail" or . == "cancel") then "fail"
        elif all(. == "pass") then "pass"
        else "pending"
        end
    ' || true)

  case "${STATE:-missing}" in
    fail|cancel)
      echo "Closing stuck Dependabot PR #$num (checks $STATE)"
      gh pr close "$num" --comment "$COMMENT" || true
      ;;
  esac
done
