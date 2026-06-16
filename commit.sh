#!/usr/bin/env bash
#
# commit.sh — publish changes to the Semantic Engineering site.
#
# Publishing model:
#   * The maintainer (OWNER) publishes directly: commit straight to main, which
#     triggers the deploy.
#   * Everyone else gets a branch + a pull request addressed to the maintainer.
#     Their changes go live only after the maintainer approves and merges.
#
# This script is a convenience. The real enforcement is the branch-protection
# rule on `main` (only the maintainer can push/merge to main) — so even if this
# script is bypassed, contributors still cannot publish directly.
#
# Usage:
#   ./commit.sh "your commit message"
#   ./commit.sh                       # uses a timestamped default message

set -euo pipefail

cd "$(dirname "$0")"

OWNER="bijoor"   # GitHub login allowed to publish directly. Others open PRs.
BASE="main"

# Commit message: all arguments joined, or a timestamped default.
if [ "$#" -gt 0 ]; then
  MSG="$*"
else
  MSG="Update site content ($(date '+%Y-%m-%d %H:%M'))"
fi

# GitHub CLI is needed to know who you are and (for contributors) to open the PR.
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required."
  echo "Install it from https://cli.github.com/ then run: gh auth login"
  exit 1
fi
ME="$(gh api user --jq .login 2>/dev/null || true)"
if [ -z "$ME" ]; then
  echo "You're not logged in to GitHub. Run: gh auth login"
  exit 1
fi

# Stage everything: new files, edits, and deletions.
git add -A
if git diff --cached --quiet; then
  echo "Nothing to commit — working tree is clean."
  exit 0
fi

echo "Staged changes:"
git status --short
echo

if [ "$ME" = "$OWNER" ]; then
  # ---- Maintainer: publish directly to main ----
  git commit -m "$MSG"
  echo "Committed: $(git rev-parse --short HEAD)"
  echo "Syncing with origin/$BASE ..."
  git pull --rebase origin "$BASE"
  echo "Pushing ..."
  git push origin "$BASE"
  echo
  echo "Done. The deploy pipeline will rebuild → https://semantic-engineering.ai/"
else
  # ---- Contributor: open a pull request for the maintainer to review ----
  BR="contrib/${ME}-$(date '+%Y%m%d-%H%M%S')"
  echo "You don't have publish rights on this site."
  echo "Opening a pull request for @$OWNER to review and merge ..."
  echo

  git switch -c "$BR"
  git commit -m "$MSG"
  git push -u origin "$BR"

  gh pr create \
    --base "$BASE" \
    --head "$BR" \
    --title "$MSG" \
    --body "Submitted via commit.sh by @$ME. Requires @$OWNER's review — it goes live only after approval and merge." \
    --reviewer "$OWNER"

  echo
  echo "Pull request opened. Your changes publish only after @$OWNER approves and merges it."
  echo "For your next edit, switch back to $BASE first:  git switch $BASE && git pull"
fi
