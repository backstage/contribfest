# Design: Restore GitHub Pages Subpath for Public Repo

**Date:** 2026-02-18
**Branch:** topic/public-subpath
**Status:** Approved

## Context

The `basePath: '/contribfest'` was previously added (commit `45cbf92`) then removed (commit `e0dec89`) because the repo was private and deployed to a root-level GitHub Pages URL. Now that the repo is being made public, it will be hosted at `https://backstage.github.io/contribfest`, so the basePath must be restored.

## Approach

**Option A — Restore basePath in next.config.ts** (selected)

Reverting commit `e0dec89` by re-adding `basePath: '/contribfest'` to `next.config.ts` and updating `docs/deployment.md` to reflect the correct subpath URL. Next.js handles all internal link prefixing automatically when `basePath` is set.

## Changes

### `next.config.ts`
Add `basePath: '/contribfest'` to the `NextConfig` object.

### `docs/deployment.md`
- Update deployment URL to `https://backstage.github.io/contribfest`
- Update local dev URL to `http://localhost:3000/contribfest`
- Restore basePath troubleshooting tip
