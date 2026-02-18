# Deployment Guide

This project automatically deploys to GitHub Pages when code is merged to the `main` branch.

## GitHub Pages Setup

**Required one-time configuration:**

1. Go to repository Settings → Pages
2. Under "Build and deployment" → "Source", select **"GitHub Actions"**
3. Save the settings

## Deployment Process

### Automatic Deployment

When you merge a PR to `main`:

1. CI workflow runs (type check, lint, test, build)
2. CD workflow waits for CI to complete
3. If CI passes:
   - CD builds the app with `/contribfest` base path
   - Deploys to GitHub Pages
   - Site updates at `https://backstage.github.io/contribfest`
4. If CI fails:
   - CD workflow is skipped
   - No deployment occurs

**Timeline:** ~3-5 minutes from merge to live

### Manual Deployment

You can trigger a deployment manually:

1. Go to Actions tab
2. Select "CD" workflow
3. Click "Run workflow"
4. Choose `main` branch
5. Click "Run workflow"

## Local Development

The app uses `/contribfest` base path to match production:

```bash
# Start dev server
yarn dev

# Visit the app at:
# http://localhost:3000/contribfest
```

## Monitoring

- **Deployment Status:** Check the Actions tab for workflow runs
- **Live Site:** https://backstage.github.io/contribfest
- **Environment:** View deployment history in Settings → Environments → github-pages

## Troubleshooting

**Deployment fails with "Resource not accessible by integration":**
- Verify Pages source is set to "GitHub Actions" in repository settings
- Check workflow has `pages: write` and `id-token: write` permissions

**Site shows 404 or assets don't load:**
- Verify `basePath: '/contribfest'` is set in `next.config.ts`
- Check build output includes all necessary files in the `out` directory
- Ensure trailing slash is enabled in config

**CI passes but CD doesn't run:**
- Check the `check-ci` job logs for the CI workflow status
- Verify the CI job name matches: "Type Check, Lint, Test & Build"
