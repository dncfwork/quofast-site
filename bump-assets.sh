#!/bin/bash
# Cache-busting for a site with no build step.
#
# GitHub Pages serves assets with cache-control: max-age=600, so for ten minutes after a deploy a
# visitor can hold NEW html against OLD css/js. That is not a blank page — it is worse: the markup
# for a feature is there and the code driving it is not, so the feature looks broken. It happened
# with the currency selector on 2026-09-21.
#
# Run this after changing anything under assets/, before committing. Every page then asks for a URL
# the browser has never seen, so the new file is always fetched.
set -euo pipefail
cd "$(dirname "$0")"
V="$(date -u +%Y%m%d%H%M)"
for f in *.html; do
  # Strip any existing ?v= then re-stamp, so the script is safe to run repeatedly.
  perl -pi -e 's{(href|src)="(assets/(?:site|generator)\.(?:css|js))(\?v=\d+)?"}{$1="$2?v='"$V"'"}g' "$f"
done
echo "assets stamped ?v=$V"
grep -ho 'assets/[a-z]*\.\(css\|js\)?v=[0-9]*' *.html | sort -u
