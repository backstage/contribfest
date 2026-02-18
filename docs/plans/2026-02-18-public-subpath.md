# Public Subpath Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore `basePath: '/contribfest'` in Next.js config so the site is correctly served at `https://backstage.github.io/contribfest` when the repo goes public.

**Architecture:** Next.js `basePath` automatically prefixes all internal routes and asset paths at build time. Adding one line to `next.config.ts` is sufficient — no component changes needed. Update `docs/deployment.md` to reflect the correct URLs.

**Tech Stack:** Next.js 15 (static export), GitHub Pages, GitHub Actions

---

### Task 1: Restore basePath in next.config.ts

**Files:**
- Modify: `next.config.ts`

**Step 1: Add basePath**

Open `next.config.ts`. It currently reads:

```typescript
const nextConfig: NextConfig = {
  output: 'export',     // Enable static export
  trailingSlash: true,  // Clean URLs
  images: {
    unoptimized: true   // Required for static export
  }
}
```

Add `basePath` as the second property:

```typescript
const nextConfig: NextConfig = {
  output: 'export',        // Enable static export
  basePath: '/contribfest', // GitHub Pages project site path
  trailingSlash: true,     // Clean URLs
  images: {
    unoptimized: true      // Required for static export
  }
}
```

**Step 2: Verify the build succeeds**

```bash
yarn build
```

Expected: Build completes with no errors. The `out/` directory should contain files with paths prefixed correctly (e.g., `out/contribfest/` structure is NOT produced — Next.js handles the prefix at the HTML/JS level, not folder level).

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: restore basePath for GitHub Pages subpath deployment"
```

---

### Task 2: Update docs/deployment.md

**Files:**
- Modify: `docs/deployment.md`

**Step 1: Update the deployment process section**

Find (line 22):
```
   - CD builds the app for static export
   - Deploys to GitHub Pages
   - Site updates at the configured GitHub Pages URL
```

Replace with:
```
   - CD builds the app with `/contribfest` base path
   - Deploys to GitHub Pages
   - Site updates at `https://backstage.github.io/contribfest`
```

**Step 2: Update the local dev section**

Find (lines 43-51):
```markdown
Start the development server:

```bash
# Start dev server
yarn dev

# Visit the app at:
# http://localhost:3000
```
```

Replace with:
```markdown
The app uses `/contribfest` base path to match production:

```bash
# Start dev server
yarn dev

# Visit the app at:
# http://localhost:3000/contribfest
```
```

**Step 3: Update the monitoring section**

Find (line 56):
```
- **Live Site:** Check Settings → Pages for your deployment URL
```

Replace with:
```
- **Live Site:** https://backstage.github.io/contribfest
```

**Step 4: Update the troubleshooting section**

Find (lines 65-68):
```
**Site shows 404 or assets don't load:**
- Check build output includes all necessary files in the `out` directory
- Verify Next.js config has `output: 'export'` enabled
- Ensure trailing slash is enabled in config
```

Replace with:
```
**Site shows 404 or assets don't load:**
- Verify `basePath: '/contribfest'` is set in `next.config.ts`
- Check build output includes all necessary files in the `out` directory
- Ensure trailing slash is enabled in config
```

**Step 5: Commit**

```bash
git add docs/deployment.md
git commit -m "docs: update deployment guide for subpath hosting"
```

---

### Task 3: Verify locally

**Step 1: Start dev server and confirm subpath**

```bash
yarn dev
```

Open `http://localhost:3000/contribfest` in a browser.

Expected: The app loads correctly. Navigation links stay within `/contribfest/...`. Static assets (favicon, PDFs) load without 404s.

**Step 2: Confirm `http://localhost:3000` redirects or 404s**

Expected: Root URL does not serve the app (Next.js enforces the basePath).

---
