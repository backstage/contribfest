# CD Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add GitHub Actions CD workflow to automatically deploy Next.js app to GitHub Pages after merges to main.

**Architecture:** Separate CD workflow that depends on CI passing, builds with basePath configuration, and deploys directly to GitHub Pages using modern Actions deployment.

**Tech Stack:** GitHub Actions, Next.js 15 static export, GitHub Pages

---

## Task 1: Update Next.js Configuration

**Files:**
- Modify: `next.config.ts:1-11`

**Step 1: Read current configuration**

Run: `cat next.config.ts`
Expected: See current config with `output: 'export'`

**Step 2: Update configuration to add basePath**

Add `basePath: '/contribfest'` to the config:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',        // Enable static export
  basePath: '/contribfest', // GitHub Pages project site path
  trailingSlash: true,     // Clean URLs
  images: {
    unoptimized: true      // Required for static export
  }
}

export default nextConfig
```

**Step 3: Test local build with basePath**

Run: `yarn build`
Expected: Build succeeds, output shows "Compiled successfully" and creates `out/` directory

**Step 4: Verify build output structure**

Run: `ls -la out/`
Expected: See `index.html`, `_next/` directory, and other static assets

**Step 5: Test local development server**

Run: `yarn dev` (in background or separate terminal)
Expected: Server starts at http://localhost:3000

Then visit: `http://localhost:3000/contribfest`
Expected: App loads correctly with `/contribfest` base path

**Step 6: Commit configuration change**

```bash
git add next.config.ts
git commit -m "feat: add basePath for GitHub Pages deployment

Configure Next.js to use /contribfest base path for project site deployment.
This ensures all routes and assets are correctly prefixed when deployed
to username.github.io/contribfest.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create CD Workflow File

**Files:**
- Create: `.github/workflows/cd.yml`

**Step 1: Create CD workflow file**

Create `.github/workflows/cd.yml` with complete workflow configuration:

```yaml
name: CD

on:
  push:
    branches: [main]
  workflow_dispatch:

# Cancel in-progress deployments for same branch
concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

# Required permissions for GitHub Pages deployment
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  # Wait for CI to complete before deploying
  check-ci:
    name: Wait for CI
    runs-on: ubuntu-latest
    steps:
      - name: Wait for CI workflow
        uses: lewagon/wait-on-check-action@v1.3.1
        with:
          ref: ${{ github.ref }}
          check-name: 'Type Check, Lint, Test & Build'
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          wait-interval: 10

  build:
    name: Build
    needs: check-ci
    runs-on: ubuntu-latest
    timeout-minutes: 15

    env:
      CI: true
      NODE_OPTIONS: --max-old-space-size=4096

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Enable Corepack
        run: corepack enable

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'

      - name: Cache Next.js build
        uses: actions/cache@v4
        with:
          path: |
            .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-

      - name: Install dependencies
        run: yarn install --immutable

      - name: Build
        run: yarn build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Validate YAML syntax**

Run: `cat .github/workflows/cd.yml | head -20`
Expected: See properly formatted YAML with no syntax errors

**Step 3: Verify workflow triggers and permissions**

Check the file contains:
- `on: push: branches: [main]`
- `permissions: pages: write` and `id-token: write`
- `concurrency` group for deployment control

**Step 4: Commit CD workflow**

```bash
git add .github/workflows/cd.yml
git commit -m "feat: add CD workflow for GitHub Pages deployment

Add GitHub Actions workflow that:
- Waits for CI to pass before deploying
- Builds Next.js app with basePath configuration
- Deploys to GitHub Pages using actions/deploy-pages
- Only triggers on pushes to main branch

Requires repository Pages settings to use 'GitHub Actions' as source.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Verification and Documentation

**Files:**
- Create: `docs/deployment.md`

**Step 1: Create deployment documentation**

Create `docs/deployment.md`:

```markdown
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
   - Site updates at `https://[username].github.io/contribfest`
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
- **Live Site:** https://[username].github.io/contribfest
- **Environment:** View deployment history in Settings → Environments → github-pages

## Troubleshooting

**Deployment fails with "Resource not accessible by integration":**
- Verify Pages source is set to "GitHub Actions" in repository settings
- Check workflow has `pages: write` and `id-token: write` permissions

**Site shows 404 or assets don't load:**
- Verify `basePath: '/contribfest'` is set in `next.config.ts`
- Check build output includes all necessary files
- Ensure trailing slash is enabled in config

**CI passes but CD doesn't run:**
- Check the `check-ci` job logs for the CI workflow status
- Verify the CI job name matches: "Type Check, Lint, Test & Build"
```

**Step 2: Commit documentation**

```bash
git add docs/deployment.md
git commit -m "docs: add deployment guide for GitHub Pages

Document the CD workflow setup, deployment process, and troubleshooting steps.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Step 3: Verify all commits**

Run: `git log --oneline -5`
Expected: See 3 new commits for config, workflow, and docs

**Step 4: Final verification checklist**

Before pushing, verify:
- [ ] `next.config.ts` has `basePath: '/contribfest'`
- [ ] `.github/workflows/cd.yml` exists and is valid YAML
- [ ] `docs/deployment.md` documents the setup process
- [ ] All files committed with descriptive messages
- [ ] Local build succeeds: `yarn build`

---

## Post-Implementation Steps

**After merging to main:**

1. **Configure GitHub Pages:**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Verify first deployment:**
   - Check Actions tab for CD workflow run
   - Wait for deployment to complete
   - Visit `https://[username].github.io/contribfest`
   - Test navigation and asset loading

3. **Monitor:**
   - Check deployment logs if issues occur
   - Verify CI/CD dependency works correctly

**If deployment fails:**
- Review workflow logs in Actions tab
- Check repository Pages settings
- Verify permissions are correct
- See troubleshooting section in `docs/deployment.md`
