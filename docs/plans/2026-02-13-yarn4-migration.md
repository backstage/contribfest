# Yarn 4 Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the contribfest Next.js project from npm to Yarn 4 using node_modules mode.

**Architecture:** Clean slate migration - remove npm artifacts, enable Yarn 4 via Corepack, configure for node_modules mode, install dependencies, verify functionality, and update git tracking.

**Tech Stack:** Yarn 4, Corepack, Next.js 15, TypeScript

---

## Task 1: Enable Corepack and Configure Yarn

**Files:**
- Modify: `package.json` (add packageManager field)

**Step 1: Check Node version supports Corepack**

Run: `node --version`
Expected: v16.9.0 or higher (Corepack ships with Node 16.9+)

**Step 2: Enable Corepack**

Run: `corepack enable`
Expected: No output (success) or "Corepack is now enabled"

**Step 3: Check current Yarn version available**

Run: `corepack prepare yarn@stable --activate`
Expected: Downloads and activates latest stable Yarn 4.x

**Step 4: Verify Yarn 4 is available**

Run: `yarn --version`
Expected: Output shows 4.x.x (e.g., "4.1.0")

**Step 5: Add packageManager field to package.json**

Read the current Yarn version from step 4, then modify `package.json` to add the exact version.

In `package.json`, add after the "private" field:
```json
"packageManager": "yarn@4.x.x",
```
(Replace 4.x.x with the actual version from step 4)

**Step 6: Verify packageManager field**

Run: `yarn --version`
Expected: Same version as specified in package.json

**Step 7: Commit packageManager configuration**

Run:
```bash
git add package.json
git commit -m "chore: configure Yarn 4 as package manager via Corepack

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
Expected: Commit succeeds

---

## Task 2: Create Yarn Configuration

**Files:**
- Create: `.yarnrc.yml`

**Step 1: Create .yarnrc.yml with node_modules configuration**

Create file `.yarnrc.yml` with this content:
```yaml
# Use traditional node_modules instead of Plug'n'Play
nodeLinker: node-modules

# Use project-local cache for isolation
enableGlobalCache: false

# Faster installs with mixed compression
compressionLevel: mixed
```

**Step 2: Verify configuration file syntax**

Run: `yarn config`
Expected: Shows current configuration including the settings from .yarnrc.yml

**Step 3: Commit Yarn configuration**

Run:
```bash
git add .yarnrc.yml
git commit -m "chore: configure Yarn for node_modules mode

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
Expected: Commit succeeds

---

## Task 3: Remove npm Artifacts

**Files:**
- Delete: `package-lock.json`
- Delete: `node_modules/` (directory)

**Step 1: Verify current npm artifacts exist**

Run: `ls -la package-lock.json node_modules/ | head -5`
Expected: Shows package-lock.json exists and node_modules directory exists

**Step 2: Remove package-lock.json**

Run: `rm package-lock.json`
Expected: File deleted (no output)

**Step 3: Remove node_modules directory**

Run: `rm -rf node_modules`
Expected: Directory deleted (no output)

**Step 4: Verify artifacts are removed**

Run: `ls package-lock.json node_modules 2>&1`
Expected: "No such file or directory" errors (confirms deletion)

**Step 5: Commit removal of package-lock.json**

Run:
```bash
git add -u package-lock.json
git commit -m "chore: remove package-lock.json for Yarn migration

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
Expected: Commit succeeds

---

## Task 4: Install Dependencies with Yarn

**Files:**
- Create: `yarn.lock`
- Create: `.yarn/install-state.gz`
- Create: `node_modules/` (directory)

**Step 1: Install dependencies**

Run: `yarn install`
Expected:
- Progress messages showing package downloads
- "success Saved lockfile"
- No errors
- Completes successfully

**Step 2: Verify yarn.lock was created**

Run: `ls -lh yarn.lock`
Expected: Shows yarn.lock file exists with reasonable size (e.g., 100-500KB)

**Step 3: Verify node_modules was created**

Run: `ls node_modules/ | wc -l`
Expected: Shows significant number of packages (likely 200+)

**Step 4: Verify critical dependencies are present**

Run: `ls node_modules/next node_modules/react node_modules/@backstage`
Expected: All three directories exist

**Step 5: Check .yarn directory contents**

Run: `ls -la .yarn/`
Expected: Shows install-state.gz and possibly cache directory

**Step 6: Commit yarn.lock**

Run:
```bash
git add yarn.lock
git commit -m "chore: add yarn.lock from initial Yarn install

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
Expected: Commit succeeds

---

## Task 5: Update .gitignore for Yarn

**Files:**
- Modify: `.gitignore`

**Step 1: Read current .gitignore**

Run: `cat .gitignore`
Expected: Shows current gitignore contents (likely has node_modules already)

**Step 2: Add Yarn-specific entries to .gitignore**

Append to `.gitignore`:
```
# Yarn
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.pnp.*
```

**Step 3: Verify .gitignore was updated**

Run: `tail -10 .gitignore`
Expected: Shows the Yarn entries we just added

**Step 4: Check what would be ignored**

Run: `git status`
Expected: Should NOT show .yarn/cache or .yarn/install-state.gz as untracked (they should be ignored)

**Step 5: Commit .gitignore update**

Run:
```bash
git add .gitignore
git commit -m "chore: update .gitignore for Yarn 4

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
Expected: Commit succeeds

---

## Task 6: Verify All npm Scripts Work

**Files:**
- None (verification only)

**Step 1: Test development server**

Run: `yarn dev &`
Wait 5 seconds, then check: `curl -s http://localhost:3000 | head -20`
Expected: HTML response from Next.js app
Then: `pkill -f "next dev"` to stop the server

**Step 2: Test linting**

Run: `yarn lint`
Expected: Linting completes (may show warnings but should not error on Yarn itself)

**Step 3: Test production build**

Run: `yarn build`
Expected:
- "Compiled successfully"
- Creates `.next` directory
- No errors related to package resolution

**Step 4: Verify TypeScript can resolve types**

Run: `yarn tsc --noEmit`
Expected: No errors (or only pre-existing errors, not module resolution issues)

**Step 5: Check that all dependencies are properly resolved**

Run: `yarn why next`
Expected: Shows dependency tree for Next.js without errors

---

## Task 7: Final Verification and Documentation

**Files:**
- Create: `docs/plans/MIGRATION-NOTES.md` (optional documentation)

**Step 1: Verify no npm artifacts remain**

Run: `find . -name "package-lock.json" -o -name ".npmrc" 2>/dev/null | grep -v node_modules`
Expected: No output (no npm files found)

**Step 2: Verify git status is clean**

Run: `git status`
Expected: "nothing to commit, working tree clean"

**Step 3: Review commit history**

Run: `git log --oneline -7`
Expected: Shows all our migration commits in order

**Step 4: Create summary of migration (optional)**

Create `docs/plans/MIGRATION-NOTES.md`:
```markdown
# Yarn 4 Migration - Completed

**Date:** 2026-02-13
**Status:** ✅ Complete

## What Changed

- Package manager: npm → Yarn 4
- Lockfile: package-lock.json → yarn.lock
- Configuration: Added .yarnrc.yml (node_modules mode)

## For Team Members

To work with this project now:

1. One-time setup: `corepack enable`
2. Install dependencies: `yarn install` (or just `yarn`)
3. All scripts work the same: `yarn dev`, `yarn build`, `yarn lint`

## Commands

| Old (npm) | New (yarn) |
|-----------|------------|
| `npm install` | `yarn` or `yarn install` |
| `npm install pkg` | `yarn add pkg` |
| `npm uninstall pkg` | `yarn remove pkg` |
| `npm run script` | `yarn script` |

## Verification

All tests passed:
- ✅ Development server starts
- ✅ Production build succeeds
- ✅ Linting works
- ✅ TypeScript resolves correctly
```

**Step 5: Commit migration notes (if created)**

Run:
```bash
git add docs/plans/MIGRATION-NOTES.md
git commit -m "docs: add Yarn 4 migration completion notes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
Expected: Commit succeeds

**Step 6: Final check - list all migration commits**

Run: `git log --oneline --grep="yarn\|Yarn" -i`
Expected: Shows all commits related to this migration

---

## Success Criteria Checklist

After completing all tasks, verify:

- [ ] Corepack is enabled
- [ ] `yarn --version` shows 4.x.x
- [ ] `package.json` has `packageManager` field
- [ ] `.yarnrc.yml` exists with node_modules configuration
- [ ] `yarn.lock` exists
- [ ] `package-lock.json` is deleted and removed from git
- [ ] `.gitignore` includes Yarn-specific entries
- [ ] `yarn dev` starts development server
- [ ] `yarn build` completes successfully
- [ ] `yarn lint` runs without errors
- [ ] `yarn tsc --noEmit` has no module resolution errors
- [ ] All changes are committed to git
- [ ] Working tree is clean

## Rollback Procedure

If any step fails and you need to rollback:

1. `git log --oneline -10` - find commit before migration started
2. `git reset --hard <commit-hash>` - reset to that commit
3. `rm -rf node_modules .yarn yarn.lock .yarnrc.yml`
4. `npm install` - restore npm setup

## Estimated Time

- Task 1: 3 minutes
- Task 2: 2 minutes
- Task 3: 2 minutes
- Task 4: 5 minutes (depends on download speed)
- Task 5: 2 minutes
- Task 6: 10 minutes (includes build time)
- Task 7: 3 minutes

**Total: ~25-30 minutes**
