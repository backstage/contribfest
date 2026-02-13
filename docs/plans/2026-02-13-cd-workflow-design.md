# CD Workflow Design for GitHub Pages Deployment

**Date:** 2026-02-13
**Status:** Approved

## Overview

This design adds a Continuous Deployment (CD) workflow to automatically deploy the Next.js application to GitHub Pages after code is merged to the `main` branch.

## Requirements

- Deploy to GitHub Pages at `username.github.io/contribfest` (project site)
- Only deploy after CI workflow passes
- Use modern GitHub Actions Pages deployment
- Maintain consistency with existing CI setup

## Architecture

### Approach: Direct GitHub Actions Pages Deployment

The CD workflow will be a separate workflow file (`.github/workflows/cd.yml`) that:

- Triggers only on pushes to `main` branch
- Depends on CI completion to ensure code quality
- Builds the Next.js app with correct `basePath` configuration
- Deploys directly to GitHub Pages using GitHub Actions as the source

This creates clean separation of concerns:
- **CI workflow** validates code quality (type check, lint, test, build)
- **CD workflow** deploys validated code to production

Both workflows can run in parallel initially, but CD waits for CI to succeed before proceeding with deployment.

## Workflow Configuration

### Job 1: Build

**Trigger:** Push to `main` branch
**Steps:**
1. Checkout code
2. Setup Node.js 22 with Yarn cache
3. Enable Corepack for Yarn 4.4.1
4. Install dependencies with `yarn install --immutable`
5. Build with `yarn build` (produces static export to `out/`)
6. Upload `out/` directory as Pages artifact

### Job 2: Deploy

**Dependencies:** Requires `build` job completion
**Environment:** `github-pages`
**Concurrency:** Single deployment at a time (cancels in-progress)
**Permissions:**
- `pages: write` - publish to GitHub Pages
- `id-token: write` - OIDC token for secure deployment
- `contents: read` - checkout code

**Steps:**
1. Deploy artifact using `actions/deploy-pages`

## Next.js Configuration Changes

Update `next.config.ts` to add `basePath` for project site deployment:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/contribfest',  // NEW: Required for project site
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

**Impact:**
- All routes prefixed with `/contribfest`
- Asset paths correctly resolved
- Local development runs at `http://localhost:3000/contribfest`

## Repository Settings

### Required Configuration

1. **GitHub Pages Settings:**
   - Navigate to repository Settings → Pages
   - Set "Source" to **"GitHub Actions"**
   - This enables direct deployment from workflow

2. **Workflow Permissions:**
   - Already specified in workflow file
   - No additional secrets needed
   - GitHub Actions handles authentication automatically

## Deployment Flow

### When code is merged to `main`:

1. CI workflow starts (type check, lint, test, build)
2. CD workflow starts but waits for CI
3. CI completes (pass/fail)
4. **If CI passes:**
   - CD build job runs
   - Installs dependencies and builds with `basePath`
   - Uploads artifact
   - Deploy job publishes to GitHub Pages
   - Site updates at `https://username.github.io/contribfest`
5. **If CI fails:**
   - CD workflow skips execution
   - No deployment occurs

**Timeline:** ~3-5 minutes from merge to live site

## Validation

### Post-Deployment Verification

1. **Workflow validation:**
   - Check Actions tab for CD workflow status
   - Verify CI dependency works correctly
   - Confirm build and deploy jobs succeed

2. **Site validation:**
   - Visit `https://username.github.io/contribfest`
   - Test all page navigation
   - Verify assets load correctly
   - Check base path routing

3. **Local development validation:**
   - Run `yarn dev`
   - Visit `http://localhost:3000/contribfest`
   - Confirm functionality matches production

### Monitoring

- GitHub Environments section shows deployment history
- Each deployment logged in Actions workflow
- Failed deployments don't affect live site (rollback protection)

## Trade-offs Considered

### Selected Approach: GitHub Actions Direct Deployment
**Pros:** Modern, officially supported, clean git history, atomic deployments
**Cons:** Requires repository settings change

### Rejected: gh-pages Branch Deployment
**Reason:** Creates unnecessary branch management and messy git history

### Rejected: Manual Approval Gates
**Reason:** Adds friction without benefit for this project scale

## Implementation Notes

- Workflow file: `.github/workflows/cd.yml`
- Next.js config change: `next.config.ts`
- No new dependencies required
- Follows existing CI patterns for consistency
