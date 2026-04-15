---
name: remove-contribfest-label
description: Use when the ContribFest event is over and you need to clean up GitHub issue labels — removes the "contribfest" label from every issue in public/issues.csv and adds "good first issue" to all Beginner-level issues in both the backstage/backstage and backstage/community-plugins repos.
---

# Remove ContribFest Label

## Overview

Reads `public/issues.csv`, then uses the `gh` CLI to:
1. Remove the `contribfest` label from every issue listed
2. Add the `good first issue` label to every issue with `level = Beginner`

Assumes `gh` is already authenticated. Errors (e.g. label not present) are skipped silently.

## CSV Format

```
repo,level,issueId
backstage/backstage,Beginner,33375
backstage/community-plugins,Intermediate,1234
```

Repos present: `backstage/backstage` and `backstage/community-plugins`.

## Step 1: Parse the CSV

From the repo root, print a quick summary so the user can confirm before making changes:

```bash
echo "Issues to process: $(tail -n +2 public/issues.csv | wc -l | tr -d ' ')"
echo "Beginner issues (will get 'good first issue'): $(grep -i ',Beginner,' public/issues.csv | wc -l | tr -d ' ')"
```

Tell the user what is about to happen and ask for confirmation before proceeding.

## Step 2: Process Each Issue

Loop through every non-header row and apply the label changes. Run these sequentially — one issue at a time — so failures are easy to spot.

For **every** issue (remove `contribfest`):
```bash
gh issue edit {issueId} --repo {repo} --remove-label "contribfest" 2>/dev/null || true
```

For **Beginner** issues only (add `good first issue`):
```bash
gh issue edit {issueId} --repo {repo} --add-label "good first issue" 2>/dev/null || true
```

The `2>/dev/null || true` ensures the loop continues silently if a label isn't present or the API call fails.

### Full loop (run from repo root)

```bash
tail -n +2 public/issues.csv | while IFS=, read -r repo level issueId; do
  echo "Processing $repo#$issueId (level: $level)..."
  gh issue edit "$issueId" --repo "$repo" --remove-label "contribfest" 2>/dev/null || true
  if [ "$(echo "$level" | tr '[:upper:]' '[:lower:]')" = "beginner" ]; then
    gh issue edit "$issueId" --repo "$repo" --add-label "good first issue" 2>/dev/null || true
  fi
done
```

## Step 3: Print Summary

After the loop completes, print:

```
=== ContribFest Label Cleanup Complete ===

"contribfest" label removal attempted on: <total> issues
"good first issue" label added to: <beginner_count> issues

Repos affected:
  - backstage/backstage
  - backstage/community-plugins
```

Compute the counts from the CSV before running the loop so they are available for the summary.
