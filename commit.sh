#!/usr/bin/env bash
#
# commit.sh — stage all changes, commit, sync with the remote, and push.
#
# Usage:
#   ./commit.sh "your commit message"
#   ./commit.sh                       # uses a timestamped default message
#
# After pushing to main, GitHub Actions rebuilds and deploys to:
#   https://accionlabs.github.io/semantic-engineering/

set -euo pipefail

# Always run from the directory this script lives in.
cd "$(dirname "$0")"

BRANCH="main"

# Commit message: all arguments joined, or a timestamped default.
if [ "$#" -gt 0 ]; then
  MSG="$*"
else
  MSG="Update site content ($(date '+%Y-%m-%d %H:%M'))"
fi

# Stage everything: new files, edits, and deletions.
git add -A

# Bail out cleanly if there is nothing to commit.
if git diff --cached --quiet; then
  echo "Nothing to commit — working tree is clean."
  exit 0
fi

echo "Staged changes:"
git status --short
echo

git commit -m "$MSG"
echo "Committed: $(git rev-parse --short HEAD)"
echo

# Pull in any remote changes first (e.g. the workflow file edited via the web
# editor), rebasing this commit on top, so the push isn't rejected.
echo "Syncing with origin/$BRANCH ..."
git pull --rebase origin "$BRANCH"

echo "Pushing ..."
git push origin "$BRANCH"

echo
echo "Done. The deploy workflow will rebuild → https://accionlabs.github.io/semantic-engineering/"
