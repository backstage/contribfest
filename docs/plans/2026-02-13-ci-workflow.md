# CI Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add GitHub Actions CI workflow that validates PRs with type checking, linting, tests, and build verification.

**Architecture:** Single sequential job that runs all checks in order. Uses Node 22, Yarn 4 caching, and Next.js best practices for static export builds.

**Tech Stack:** GitHub Actions, Node.js 22, Yarn 4, Next.js 15, TypeScript, ESLint

---

## Task 1: Create GitHub Actions Workflow Directory

**Files:**
- Create: `.github/workflows/` (directory)

**Step 1: Create the workflows directory**

Run:
```bash
mkdir -p .github/workflows
```

Expected: Directory created successfully

**Step 2: Verify directory structure**

Run:
```bash
ls -la .github/
```

Expected: `workflows/` directory exists

**Step 3: Commit**

```bash
git add .github/workflows/.gitkeep
git commit -m "chore: add GitHub Actions workflows directory

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Base CI Workflow File

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create workflow file with name and triggers**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: ['**']
  push:
    branches: [main]
  workflow_dispatch:
```

**Step 2: Verify YAML syntax**

Run:
```bash
cat .github/workflows/ci.yml
```

Expected: Valid YAML with trigger configuration

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add workflow triggers for PRs and main branch

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Add Job Configuration and Environment Setup

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add job configuration with Node.js setup**

Add to `.github/workflows/ci.yml`:

```yaml
jobs:
  test:
    name: Type Check, Lint, Test & Build
    runs-on: ubuntu-latest
    timeout-minutes: 15

    env:
      CI: true
      NODE_OPTIONS: --max-old-space-size=4096

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'
```

**Step 2: Verify workflow syntax**

Run:
```bash
cat .github/workflows/ci.yml
```

Expected: Complete workflow with job and Node.js setup

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add job configuration with Node 22 and Yarn caching

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Add Next.js Build Cache Configuration

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add Next.js cache step after Node setup**

Add after the `Setup Node.js` step in `.github/workflows/ci.yml`:

```yaml
      - name: Cache Next.js build
        uses: actions/cache@v4
        with:
          path: |
            .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-
```

**Step 2: Verify cache configuration**

Run:
```bash
grep -A 6 "Cache Next.js" .github/workflows/ci.yml
```

Expected: Cache step with correct paths and keys

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add Next.js build cache for faster builds

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Add Dependency Installation Step

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add yarn install step**

Add after cache steps in `.github/workflows/ci.yml`:

```yaml
      - name: Install dependencies
        run: yarn install --immutable
```

**Step 2: Verify install step**

Run:
```bash
grep -A 1 "Install dependencies" .github/workflows/ci.yml
```

Expected: Install step with `--immutable` flag

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add dependency installation with immutable lockfile

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Add Type Checking Step

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add TypeScript type check step**

Add after install step in `.github/workflows/ci.yml`:

```yaml
      - name: Type check
        run: yarn tsc --noEmit
```

**Step 2: Verify type check step**

Run:
```bash
grep -A 1 "Type check" .github/workflows/ci.yml
```

Expected: Type check step with tsc command

**Step 3: Test locally**

Run:
```bash
yarn tsc --noEmit
```

Expected: Type check passes successfully

**Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add TypeScript type checking step

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Add Linting Step

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add ESLint step**

Add after type check step in `.github/workflows/ci.yml`:

```yaml
      - name: Lint
        run: yarn lint
```

**Step 2: Verify lint step**

Run:
```bash
grep -A 1 "Lint" .github/workflows/ci.yml
```

Expected: Lint step with yarn lint command

**Step 3: Test locally**

Run:
```bash
yarn lint
```

Expected: Lint passes successfully

**Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add ESLint checking step

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add Test Step (Placeholder)

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add test step with conditional execution**

Add after lint step in `.github/workflows/ci.yml`:

```yaml
      - name: Test
        run: yarn test
        continue-on-error: true
```

**Step 2: Verify test step**

Run:
```bash
grep -A 2 "name: Test" .github/workflows/ci.yml
```

Expected: Test step with continue-on-error flag

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add test step placeholder for future tests

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Add Build Step

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add Next.js build step**

Add after test step in `.github/workflows/ci.yml`:

```yaml
      - name: Build
        run: yarn build
```

**Step 2: Verify build step**

Run:
```bash
grep -A 1 "name: Build" .github/workflows/ci.yml
```

Expected: Build step with yarn build command

**Step 3: Test locally**

Run:
```bash
yarn build
```

Expected: Build completes successfully and generates `out/` directory

**Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add Next.js build step for static export

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Verify Complete Workflow

**Files:**
- Read: `.github/workflows/ci.yml`

**Step 1: Review complete workflow file**

Run:
```bash
cat .github/workflows/ci.yml
```

Expected: Complete workflow with all steps in order:
- Checkout
- Setup Node.js with cache
- Cache Next.js build
- Install dependencies
- Type check
- Lint
- Test
- Build

**Step 2: Validate YAML syntax online or with yamllint**

Run (if yamllint installed):
```bash
yamllint .github/workflows/ci.yml
```

Or manually verify the YAML is valid.

Expected: No syntax errors

**Step 3: Check workflow file structure**

Run:
```bash
wc -l .github/workflows/ci.yml
```

Expected: ~50-60 lines

---

## Task 11: Update README with CI Badge (Optional)

**Files:**
- Modify: `README.md` (if exists)

**Step 1: Check if README exists**

Run:
```bash
ls -la README.md
```

**Step 2: If README exists, add CI badge at top**

Add after title in `README.md`:

```markdown
[![CI](https://github.com/[owner]/[repo]/actions/workflows/ci.yml/badge.svg)](https://github.com/[owner]/[repo]/actions/workflows/ci.yml)
```

Replace `[owner]` and `[repo]` with actual values from git remote.

**Step 3: Get GitHub repository info**

Run:
```bash
git remote get-url origin
```

Expected: GitHub URL to extract owner/repo

**Step 4: Commit (if README was modified)**

```bash
git add README.md
git commit -m "docs: add CI badge to README

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Create Pull Request

**Files:**
- N/A (Git operation)

**Step 1: Push branch to remote**

Run:
```bash
git push -u origin topic/add-ci
```

Expected: Branch pushed successfully

**Step 2: Create pull request**

Run:
```bash
gh pr create --title "Add CI workflow for PRs" --body "$(cat <<'EOF'
## Summary
- Adds GitHub Actions CI workflow for pull request validation
- Runs type checking, linting, tests (placeholder), and build
- Uses Node 22 with Yarn 4 caching
- Implements Next.js best practices for static export

## Implementation
- Sequential job for simplicity and efficiency
- Caches both Yarn dependencies and Next.js build outputs
- Sets appropriate timeouts and memory limits
- Continues on test errors (no tests yet)

## Testing
The workflow will run on this PR and validate itself.

Closes #[issue-number-if-applicable]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR created with URL returned

**Step 3: Verify workflow runs**

- Go to PR URL
- Click "Checks" tab
- Verify CI workflow starts and runs all steps

Expected: All checks pass ✓

---

## Success Criteria

- ✅ Workflow file exists at `.github/workflows/ci.yml`
- ✅ Workflow triggers on PRs and pushes to main
- ✅ All checks run in correct order: typecheck → lint → test → build
- ✅ Yarn 4 and Next.js caches configured
- ✅ Workflow runs successfully on PR
- ✅ CI badge added to README (if applicable)

## Testing Strategy

1. Local verification: Run each command locally before committing
2. Commit frequently: Each task gets its own commit
3. PR validation: Create PR and verify workflow runs successfully
4. Manual trigger: Test workflow_dispatch trigger from GitHub UI

## Rollback Plan

If workflow has issues:
1. Check workflow run logs in GitHub Actions
2. Fix issues in separate commits
3. Push fixes to same branch
4. Workflow re-runs automatically

## References

- GitHub Actions documentation: https://docs.github.com/en/actions
- actions/setup-node: https://github.com/actions/setup-node
- actions/cache: https://github.com/actions/cache
- Next.js CI best practices: https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching
