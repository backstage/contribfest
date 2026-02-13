# CI Workflow Design

**Date:** 2026-02-13
**Status:** Approved

## Overview

This document describes the design for a GitHub Actions CI workflow that validates Pull Requests for the contribfest Next.js application.

## Context

- **Project:** Next.js 15 app with TypeScript and static export
- **Package Manager:** Yarn 4.4.1
- **Current State:** No existing CI/CD workflows
- **Test Status:** No test framework configured yet (placeholder step for future)

## Goals

- Validate every PR with automated checks before merging
- Run type checking, linting, tests (placeholder), and build verification
- Implement Next.js best practices for CI
- Maintain fast feedback loops for contributors

## Design

### Approach

**Single Sequential Job:** All checks run in one job, sequentially. This provides simplicity, efficient CI minute usage, and clear execution order. Suitable for the current project size and complexity.

### Workflow Triggers

The workflow triggers on:
- **Pull requests:** All PR events (open, synchronize, reopened) to any branch
- **Push to main:** Validates main branch after merges
- **Manual dispatch:** Allows manual CI runs via GitHub UI

### Job Configuration

- **Runner:** `ubuntu-latest`
- **Node.js Version:** 22
- **Checkout:** Full git history using `actions/checkout@v4`
- **Node Setup:** `actions/setup-node@v4` with automatic Yarn detection

### Caching Strategy

Two-layer caching for Yarn 4 (Berry):
1. **Yarn cache:** Global cache directory (`.yarn/cache`)
2. **Install state:** `.yarn/install-state.gz` for faster dependency resolution
3. **Next.js build cache:** `.next/cache` for incremental builds
4. **Cache key:** Based on `yarn.lock` hash for automatic invalidation

Implementation uses `cache: 'yarn'` option in `setup-node` action.

### CI Check Steps

Sequential execution:
1. **Install dependencies:** `yarn install --immutable`
2. **Type checking:** `yarn tsc --noEmit`
3. **Linting:** `yarn lint`
4. **Tests:** `yarn test` (placeholder - will skip if no test script)
5. **Build:** `yarn build`

Each step must pass before proceeding. Failures halt execution and report which check failed.

### Next.js Best Practices

1. **Build output caching:** Cache `.next/cache` for faster incremental builds
2. **Environment:** Set `CI=true` for strict mode and proper error handling
3. **Static export validation:** Verify `output: 'export'` generates files successfully
4. **Memory allocation:** Use `--max-old-space-size=4096` to prevent OOM issues
5. **Timeout:** Set `timeout-minutes: 15` to prevent hung builds

## File Structure

```
.github/
  workflows/
    ci.yml          # Main CI workflow
```

## Success Criteria

- ✅ Every PR runs all checks automatically
- ✅ Type errors, lint issues, and build failures are caught before merge
- ✅ Fast feedback (< 5 minutes for typical runs with cache)
- ✅ Clear error messages when checks fail
- ✅ Workflow is maintainable and understandable by contributors

## Future Enhancements

- Add test framework (Jest/Vitest) and update test step
- Consider adding deployment preview for PRs
- Add code coverage reporting when tests are added
- Potentially split into parallel jobs if build times increase significantly

## Implementation Plan

See implementation plan in separate document (to be created via writing-plans skill).
