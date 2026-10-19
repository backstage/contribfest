---
name: remove-contribfest-label
description: Use when the ContribFest event is over and you need to clean up GitHub issue labels — removes the "contribfest" label and the optional "reserved for ContribFest" note from every issue in public/issues.csv and adds "good first issue" to all Beginner-level issues in both the backstage/backstage and backstage/community-plugins repos.
---

# Remove ContribFest Label

## Overview

Reads `public/issues.csv`, then uses the GitHub REST API via `curl` to:
1. Remove the `contribfest` label from every issue listed
2. Add the `good first issue` label to every issue with `level = Beginner`
3. Remove the optional reserve note from the top of each issue description, if present (see "Curating Issues" in `docs/organizer-runbook.md`):

   ```markdown
   > [!NOTE]
   > Do not work on this issue: it's reserved for the [Backstage ContribFest](https://contribfest.backstage.io/) at KubeCon on November 11, 2026. If it's still open afterwards, it'll be opened up to everyone. 👍
   ```

Assumes `gh` is already authenticated. Errors (e.g. label not present — returns 404) are skipped silently.

**Important:** Use `curl` with the REST API, not `gh issue edit`. The `gh` CLI uses Go's TLS stack which fails with certificate verification errors when called inside a bash loop on this machine.

## CSV Format

```
repo,level,issueId
backstage/backstage,Beginner,33375
backstage/community-plugins,Intermediate,1234
```

The CSV uses Windows-style CRLF line endings — always pipe through `tr -d '\r'` before processing.

Repos present: `backstage/backstage` and `backstage/community-plugins`.

## Step 1: Parse the CSV

From the repo root, print a quick summary so the user can confirm before making changes:

```bash
echo "Issues to process: $(tail -n +2 public/issues.csv | wc -l | tr -d ' ')"
echo "Beginner issues (will get 'good first issue'): $(grep -i ',Beginner,' public/issues.csv | wc -l | tr -d ' ')"
```

Tell the user what is about to happen and ask for confirmation before proceeding.

## Step 2: Process Each Issue

Loop through every non-header row and apply the label changes. Use `curl` with the GitHub REST API, reading the CSV via a named file descriptor (fd3) so curl's stdin is unaffected.

REST API endpoints:
- Remove label: `DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}`
- Add labels: `POST /repos/{owner}/{repo}/issues/{issue_number}/labels` with body `{"labels":["good first issue"]}`

- Get issue: `GET /repos/{owner}/{repo}/issues/{issue_number}`
- Update description: `PATCH /repos/{owner}/{repo}/issues/{issue_number}` with body `{"body":"..."}`

A `404` on the DELETE means the label wasn't present — that's expected and safe.

The note is stripped with a `jq` regex that only matches the reserve note at the very start of the description (plus any blank lines after it). The description is only PATCHed when the note was found, so issues without it are left untouched. A `403` on the PATCH means the token can't edit that issue's description; report those so the note can be removed by hand.

### Full loop (run from repo root)

```bash
GH_TOKEN=$(gh auth token)
tail -n +2 public/issues.csv | tr -d '\r' > /tmp/issues_clean.csv
while IFS=, read -r repo level issueId <&3; do
  owner="${repo%%/*}"
  reponame="${repo##*/}"
  echo "Processing $repo#$issueId (level: $level)..."
  curl -s -o /dev/null -w "%{http_code}" -X DELETE \
    -H "Authorization: Bearer $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$owner/$reponame/issues/$issueId/labels/contribfest"
  echo ""
  if [[ "$(echo "$level" | tr '[:upper:]' '[:lower:]')" == "beginner" ]]; then
    curl -s -o /dev/null -w "%{http_code}" -X POST \
      -H "Authorization: Bearer $GH_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -H "Content-Type: application/json" \
      -d '{"labels":["good first issue"]}' \
      "https://api.github.com/repos/$owner/$reponame/issues/$issueId/labels"
    echo ""
  fi
  body=$(curl -s \
    -H "Authorization: Bearer $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$owner/$reponame/issues/$issueId" | jq -r '.body // ""')
  newbody=$(jq -Rrs 'sub("^\\s*> \\[!NOTE\\]\\r?\\n> Do not work on this issue: it.s reserved for the \\[Backstage ContribFest\\][^\\n]*\\n(\\s*\\n)*"; "")' <<< "$body")
  if [[ "$newbody" != "$body" ]]; then
    echo "  Removing reserve note..."
    jq -n --arg body "$newbody" '{body: $body}' | curl -s -o /dev/null -w "%{http_code}" -X PATCH \
      -H "Authorization: Bearer $GH_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -H "Content-Type: application/json" \
      --data-binary @- \
      "https://api.github.com/repos/$owner/$reponame/issues/$issueId"
    echo ""
  fi
done 3< /tmp/issues_clean.csv
```

## Step 3: Print Summary

After the loop completes, print:

```
=== ContribFest Label Cleanup Complete ===

"contribfest" label removal attempted on: <total> issues
"good first issue" label added to: <beginner_count> issues
Reserve note removed from: <note_count> issues

Repos affected:
  - backstage/backstage
  - backstage/community-plugins
```

Compute the label counts from the CSV before running the loop so they are available for the summary. Count `<note_count>` from the "Removing reserve note..." lines in the loop output, and list any issues where the PATCH did not return `200`.
