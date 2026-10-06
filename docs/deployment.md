# Deployment Guide

This project deploys to GitHub Pages at `https://contribfest.backstage.io` when code is merged to `main`, and every hour on a schedule to refresh GitHub data.

## GitHub Pages Setup

**Required one-time configuration:**

1. Go to repository Settings → Pages
2. Under "Build and deployment" → "Source", select **"GitHub Actions"**
3. Set the custom domain to `contribfest.backstage.io`

## GitHub Data Snapshot

The site is a static export with no backend, so the browser never calls the GitHub API. Instead, `scripts/fetch-github-data.mjs` runs during the CD build and writes:

- `public/data/issues.json`: every issue in `public/issues.csv`, with title, labels, assignees, linked PRs, and an availability status (`available`, `assigned`, `has-pr`, `closed`)
- `public/data/pull-requests.json`: merged PRs labeled `contribfest` (Contrib Champs)

Issues are looked up by number, so the issues page keeps working after the `contribfest` label is removed. Only PRs that would close an issue (`Fixes #123`, or linked in the sidebar) mark it as "Has PR"; plain mentions don't.

The script uses the workflow's `GITHUB_TOKEN` and a few GraphQL points per run. If it fails, the CD run fails and Pages keeps serving the previous deployment.

## Deployment Process

### Automatic Deployment

When you merge a PR to `main`:

1. CI workflow runs (type check, lint, test, build)
2. CD workflow waits for CI to complete
3. If CI passes, CD fetches the GitHub data snapshot, builds the app, and deploys to GitHub Pages
4. If CI fails, no deployment occurs

**Timeline:** ~3-5 minutes from merge to live

### Scheduled Refresh

CD also runs every hour (`17 * * * *`) to refresh the GitHub data. Scheduled runs rebuild the current `main`, which has already passed CI, so they skip the CI wait. GitHub can delay or drop scheduled runs during busy periods, so don't rely on the schedule during the session.

### Manual Deployment / Refresh

To refresh the GitHub data immediately (for example, during the session):

1. Go to the Actions tab
2. Select the "CD" workflow
3. Click "Run workflow" on `main`

The site shows "GitHub data updated X min ago" on the issues and Contrib Champs pages.

## Local Development

```bash
# Fetch the GitHub data snapshot (needs the GitHub CLI, or any token with public read access)
GITHUB_TOKEN=$(gh auth token) yarn fetch-data

# Start dev server and visit http://localhost:3000
yarn dev
```

Add `?admin=true` to the issues page URL to bypass the countdown.

## Monitoring

- **Deployment Status:** Check the Actions tab for workflow runs
- **Live Site:** https://contribfest.backstage.io
- **Environment:** View deployment history in Settings → Environments → github-pages

## Troubleshooting

**Deployment fails with "Resource not accessible by integration":**
- Verify Pages source is set to "GitHub Actions" in repository settings
- Check workflow has `pages: write` and `id-token: write` permissions

**"Fetch GitHub data snapshot" step fails:**
- Check the step logs for the GraphQL error. Issue numbers in `public/issues.csv` that don't exist are only warnings; other errors fail the run.
- The live site keeps serving the last good deployment, so re-run the workflow once fixed.

**CI passes but CD doesn't run:**
- Check the `check-ci` job logs for the CI workflow status
- Verify the CI job name matches: "Type Check, Lint, Test & Build"
