---
name: remove-contribfest-label
description: Use when the ContribFest event is over and you need to clean up GitHub issues — removes the "contribfest" label and the "reserved for ContribFest" note from every issue in public/issues.csv, adds "good first issue" to Beginner and Intermediate issues that are open for contributions, and posts a comment on each issue explaining its status, in both the backstage/backstage and backstage/community-plugins repos.
---

# Remove ContribFest Label

## Overview

After a ContribFest, every issue in `public/issues.csv` is opened back up to everyone. Each issue gets:

1. The `contribfest` label removed
2. The reserve note removed from the top of its description, if present (see "Curating Issues" in `docs/organizer-runbook.md`):

   ```markdown
   > [!NOTE]
   > Do not work on this issue: it's reserved for the [Backstage ContribFest](https://contribfest.backstage.io/) at KubeCon on <date>. If it's still open afterwards, it'll be opened up to everyone. 👍
   ```

3. A comment explaining its status (one of three templates, below)
4. The `good first issue` label, but only for Beginner and Intermediate issues that are open for contributions

**Never post anything until the user has approved the plan and the comment wording.** Work through it with them item by item, and always include links to issues, PRs, and posted comments so they can spot check.

## Step 1: Classify every issue

Read `public/issues.csv` (`repo,level,issueId`, CRLF line endings, so pipe through `tr -d '\r'`). Then, for each issue:

- **Skip** issues that are closed. Also flag issues that are still open but have a merged ContribFest PR; the user may want to close them instead.
- **Find active work**: linked PRs (GraphQL `timelineItems` with `CROSS_REFERENCED_EVENT` and `CONNECTED_EVENT`), plus PRs opened during or after the event that fix the issue but don't link it. Search recent PRs in both repos and match them by title and files changed. The assignment sheet (`currentSession.assignmentSheetUrl`) lists who claimed what and often has the PR links.
- **Only count real ContribFest PRs as active work.** Ignore:
  - PRs opened before the event
  - Draft PRs on forks
  - PRs from core maintainers
  - Sheet claims with no PR

  Confirm borderline cases with the user.
- **Umbrella / tracking issues** (designed to take many PRs) stay open for contributions even if they have open PRs.

That gives three groups:

| Type | Who | Labels | Comment |
|---|---|---|---|
| A | Beginner/Intermediate, open for contributions | remove `contribfest`, add `good first issue` | A (plus tracking line for umbrellas) |
| B | Advanced, open for contributions | remove `contribfest` | B |
| C | Single-scope issue with an active ContribFest PR | remove `contribfest` | C |

Show the user the full list per type, with links, and get sign-off before going further.

## Step 2: Comment templates

Replace `<location>`, `<date>`, `<level>`, `<prs>` and `<repo>`. Show the drafts to the user and iterate before posting.

**A: open for contributions (Beginner / Intermediate)**

```markdown
👋 This issue was part of the [Backstage ContribFest](https://contribfest.backstage.io/) at <location> on <date>. The event has wrapped up, so it's once again open for contributions from everyone!

For ContribFest we rated it **<level>**, <description>. If you'd like to pick it up, leave a comment so others know you're working on it. 🚀
```

- Beginner: "so it's a great place to start if you're new to contributing to Backstage"
- Intermediate: "so it's a good next step if you've already made a contribution or two"
- Umbrella issues get one extra paragraph: "This is a tracking issue, so there's room for many contributions. Check the existing PRs to see what's already covered."

**B: open for contributions (Advanced)**

```markdown
👋 This issue was part of the [Backstage ContribFest](https://contribfest.backstage.io/) at <location> on <date>. The event has wrapped up, so it's once again open for contributions from everyone!

For ContribFest we rated it **Advanced**, so expect it to need a deeper understanding of the codebase. If you'd like to pick it up, leave a comment so others know you're working on it. 🚀
```

**C: work in progress**

```markdown
👋 This issue was part of the [Backstage ContribFest](https://contribfest.backstage.io/) at <location> on <date>.

Thanks to everyone who jumped in! There's an open PR for this (<prs>), and the ContribFest hosts will be reviewing it. Since it's already in progress, please check out the [other good first issues](https://github.com/<repo>/issues?q=is%3Aopen+label%3A%22good+first+issue%22) if you're looking for something to work on. 🚀
```

## Step 3: Apply the changes

Use `curl` with the GitHub REST API, not `gh issue edit`: the `gh` CLI's TLS stack fails with certificate errors inside bash loops on this machine. Read input through fd3 (`done 3< file`) so curl's stdin is unaffected.

Process one issue of each type first and have the user check them. Then run the rest **in batches of about 16**, auditing each batch (Step 4) and waiting for the user's go-ahead between batches.

For each issue:

```bash
T=$(gh auth token); API=https://api.github.com/repos/$repo/issues/$i
H=(-H "Authorization: Bearer $T" -H "Accept: application/vnd.github+json")

# 1. Remove label (404 = already gone, fine)
curl -s -m 30 --retry 3 -o /dev/null -w "%{http_code}" -X DELETE "${H[@]}" "$API/labels/contribfest"

# 2. Type A only: add good first issue
curl -s -m 30 --retry 3 -o /dev/null -w "%{http_code}" -X POST "${H[@]}" \
  -d '{"labels":["good first issue"]}' "$API/labels"

# 3. Strip the reserve note. Treat an empty fetch as a FAILURE, never as "no note"
body=$(curl -s -m 30 --retry 3 "${H[@]}" "$API" | jq -r '.body // empty')
[[ -z "$body" ]] && { echo "FETCH FAILED"; exit 1; }
newbody=$(jq -Rrs 'sub("^\\s*> \\[!NOTE\\]\\r?\\n> Do not work on this issue: it.s reserved for the \\[Backstage ContribFest\\][^\\n]*\\n(\\s*\\n)*"; "")' <<< "$body")
[[ "$newbody" != "$body" ]] && jq -n --arg b "$newbody" '{body:$b}' | \
  curl -s -m 30 --retry 3 -o /dev/null -w "%{http_code}" -X PATCH "${H[@]}" --data-binary @- "$API"

# 4. Post the comment, but only if one doesn't already exist
ex=$(curl -s -m 30 --retry 3 "${H[@]}" "$API/comments?per_page=100")
jq -e 'type=="array"' <<< "$ex" >/dev/null || { echo "CHECK FAILED, skipping comment"; exit 0; }
jq -e '[.[]|select(.body|startswith("👋 This issue was part of the [Backstage ContribFest]"))]|length>0' <<< "$ex" >/dev/null \
  && { echo "comment already exists"; exit 0; }
jq -n --arg b "$comment" '{body:$b}' | curl -s -m 30 "${H[@]}" -X POST --data-binary @- "$API/comments" | jq -r '.html_url // .message'
```

Safety rules, learned the hard way on spotty Wi-Fi:
- **Never use `--retry` on the comment POST.** A timed-out POST may still have landed, and retrying creates duplicates. The existence check makes the whole script safe to re-run instead.
- **Only one copy of the loop may run at a time.** After a laptop sleep or a timeout, check `ps -ef | grep process.sh` before starting another run.
- A `403` on the PATCH means the token can't edit that description; list those so the note can be removed by hand.

## Step 4: Audit

After each batch, and once more across all issues at the end, re-fetch every issue from GitHub and check:

- the `contribfest` label is gone
- the reserve note is gone
- `good first issue` is present for type A and absent for types B and C
- there is exactly one ContribFest comment

Fix anything flagged, then report a table to the user with a link to each issue and its comment.
