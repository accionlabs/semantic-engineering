#!/usr/bin/env bash
#
# serve.sh — stop any running Hugo dev server, clear build caches, and start fresh.
# Usage: ./serve.sh
#
# Serves at http://localhost:1313/semantic-engineering/
# Runs in the foreground — press Ctrl-C to stop.
#
# --disableFastRender keeps the search index and page titles current on every edit.

set -euo pipefail

# Always run from the directory this script lives in.
cd "$(dirname "$0")"

echo "Stopping any running 'hugo serve'..."
pkill -f "hugo serve" 2>/dev/null || true
sleep 1

echo "Clearing build caches (resources/, public/)..."
rm -rf resources public

echo "Starting Hugo dev server → http://localhost:1313/semantic-engineering/"
echo "(Ctrl-C to stop)"
exec hugo serve --port 1313 --bind 127.0.0.1 --disableFastRender
