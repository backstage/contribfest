# GitHub Fetch Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor GitHub issue fetching from 87 individual API calls to 2 bulk fetch calls using GitHub Issues List API.

**Architecture:** Replace sequential individual issue fetches with bulk fetching using GitHub's `/repos/{owner}/{repo}/issues` endpoint filtered by `contribfest` label. Build a lookup map for O(1) matching with CSV data. Maintain existing caching and error handling.

**Tech Stack:** TypeScript, Next.js 15, GitHub REST API v3

---

## Task 1: Add Bulk Fetch Function

**Files:**
- Modify: `lib/github-api.ts`

**Step 1: Add new function to fetch all contribfest issues from a single repo**

Add this function after the existing imports in `lib/github-api.ts`:

```typescript
export async function fetchContribfestIssues(
  owner: string,
  repo: string
): Promise<GitHubIssue[]> {
  const allIssues: GitHubIssue[] = []
  let page = 1
  const perPage = 100

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    if (token && token !== 'your_github_personal_access_token_here') {
      headers.Authorization = `Bearer ${token}`
    }

    while (true) {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?labels=contribfest&state=all&per_page=${perPage}&page=${page}`

      const response = await fetch(url, {
        headers,
        cache: 'force-cache',
      })

      if (!response.ok) {
        console.error(
          `Failed to fetch contribfest issues from ${owner}/${repo}: ${response.status} ${response.statusText}`
        )
        break
      }

      const issues = await response.json() as GitHubIssue[]

      if (issues.length === 0) {
        break
      }

      allIssues.push(...issues)

      // If we got fewer than perPage results, we've reached the end
      if (issues.length < perPage) {
        break
      }

      page++
    }

    console.log(`Fetched ${allIssues.length} contribfest issues from ${owner}/${repo}`)
    return allIssues
  } catch (error) {
    console.error(`Error fetching contribfest issues from ${owner}/${repo}:`, error)
    return []
  }
}
```

**Step 2: Verify the code compiles**

Run: `yarn build`
Expected: Build succeeds without TypeScript errors

**Step 3: Commit**

```bash
git add lib/github-api.ts
git commit -m "feat: add bulk fetch function for contribfest issues

Add fetchContribfestIssues function to fetch all issues with
contribfest label from a repo using GitHub Issues List API.
Handles pagination automatically.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add Lookup Map Builder Function

**Files:**
- Modify: `lib/github-api.ts`

**Step 1: Add function to build lookup map from GitHub issues**

Add this function after `fetchContribfestIssues`:

```typescript
function buildIssueLookupMap(
  backstageIssues: GitHubIssue[],
  communityPluginsIssues: GitHubIssue[]
): Map<string, GitHubIssue> {
  const map = new Map<string, GitHubIssue>()

  // Add backstage/backstage issues
  backstageIssues.forEach((issue) => {
    const key = `backstage/backstage#${issue.number}`
    map.set(key, issue)
  })

  // Add backstage/community-plugins issues
  communityPluginsIssues.forEach((issue) => {
    const key = `backstage/community-plugins#${issue.number}`
    map.set(key, issue)
  })

  return map
}
```

**Step 2: Verify the code compiles**

Run: `yarn build`
Expected: Build succeeds without TypeScript errors

**Step 3: Commit**

```bash
git add lib/github-api.ts
git commit -m "feat: add lookup map builder for GitHub issues

Add buildIssueLookupMap function to create a Map for O(1) lookup
of GitHub issues by repo and issue number.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Refactor enrichIssuesWithGitHubData Function

**Files:**
- Modify: `lib/github-api.ts`

**Step 1: Replace the entire enrichIssuesWithGitHubData function**

Replace the existing `enrichIssuesWithGitHubData` function (lines 47-89) with:

```typescript
export async function enrichIssuesWithGitHubData(
  issues: IssueRow[],
  onProgress?: (current: number, total: number) => void
): Promise<EnrichedIssue[]> {
  const enrichedIssues: EnrichedIssue[] = []

  // Report initial progress
  if (onProgress) {
    onProgress(0, issues.length)
  }

  try {
    // Step 1: Bulk fetch all contribfest issues from both repos
    console.log('Fetching contribfest issues from GitHub...')

    const [backstageIssues, communityPluginsIssues] = await Promise.all([
      fetchContribfestIssues('backstage', 'backstage'),
      fetchContribfestIssues('backstage', 'community-plugins'),
    ])

    console.log(`Total issues fetched: ${backstageIssues.length + communityPluginsIssues.length}`)

    // Step 2: Build lookup map
    const issueMap = buildIssueLookupMap(backstageIssues, communityPluginsIssues)

    // Step 3: Match CSV issues with GitHub data
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      const lookupKey = `${issue.repository}#${issue.issueId}`
      const githubData = issueMap.get(lookupKey)

      enrichedIssues.push({
        rowNumber: issue.rowNumber,
        repository: issue.repository,
        level: issue.level,
        issueId: issue.issueId,
        githubData: githubData || undefined,
        error: githubData ? undefined : 'Issue not found in GitHub or missing contribfest label',
      })

      // Report progress
      if (onProgress) {
        onProgress(i + 1, issues.length)
      }
    }

    console.log(`Matched ${enrichedIssues.filter(e => e.githubData).length}/${issues.length} issues with GitHub data`)
  } catch (error) {
    console.error('Error enriching issues with GitHub data:', error)

    // Fallback: return CSV data only
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      enrichedIssues.push({
        rowNumber: issue.rowNumber,
        repository: issue.repository,
        level: issue.level,
        issueId: issue.issueId,
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub data',
      })
    }
  }

  return enrichedIssues
}
```

**Step 2: Remove the old fetchIssueMetadata function**

Delete the `fetchIssueMetadata` function (lines 9-45) and the `delay` helper (line 7) as they're no longer needed.

Remove these lines:
```typescript
const RATE_LIMIT_DELAY = 100 // 100ms delay between requests

// Helper to delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchIssueMetadata(
  repository: string,
  issueNumber: number
): Promise<GitHubIssue | null> {
  // ... entire function body ...
}
```

**Step 3: Verify the code compiles**

Run: `yarn build`
Expected: Build succeeds without TypeScript errors

**Step 4: Commit**

```bash
git add lib/github-api.ts
git commit -m "refactor: use bulk fetch instead of individual API calls

Replace enrichIssuesWithGitHubData to use bulk fetching approach:
- Fetch all contribfest issues from both repos (2 API calls)
- Build lookup map for O(1) matching
- Match CSV entries with GitHub data
- Remove old fetchIssueMetadata and delay helper

This reduces API calls from 87 to 2, eliminating rate limit issues.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Manual Testing - Clear Cache and Test

**Files:**
- None (manual testing)

**Step 1: Start the dev server if not running**

Run: `yarn dev`
Expected: Dev server starts on http://localhost:3000

**Step 2: Open browser DevTools and clear cache**

1. Open http://localhost:3000/issues in browser
2. Open DevTools (F12 or Cmd+Opt+I)
3. Go to Application tab > Local Storage
4. Delete the `github-issues-cache` key
5. Go to Network tab

**Step 3: Refresh the page and observe**

1. Refresh the page
2. In Network tab, filter for "api.github.com"
3. Verify you see exactly 2 API calls:
   - One to `/repos/backstage/backstage/issues?labels=contribfest&state=all&per_page=100&page=1`
   - One to `/repos/backstage/community-plugins/issues?labels=contribfest&state=all&per_page=100&page=1`
4. Check Console tab for logs showing:
   - "Fetching contribfest issues from GitHub..."
   - "Fetched X contribfest issues from backstage/backstage"
   - "Fetched X contribfest issues from backstage/community-plugins"
   - "Total issues fetched: X"
   - "Matched X/87 issues with GitHub data"

**Step 4: Verify the issue table displays correctly**

1. Confirm all 87 rows appear in the table
2. Spot-check several issues have:
   - Title displayed
   - State (open/closed) shown
   - Labels visible
   - Correct links to GitHub
3. Note any issues showing "Issue not found" error (expected for issues without contribfest label)

**Step 5: Test cache works**

1. Refresh page again
2. Verify instant load (no API calls in Network tab)
3. Check Console shows no fetch logs (loading from cache)

**Expected results:**
- ✅ Only 2 GitHub API calls instead of 87
- ✅ Page loads in ~2-3 seconds (vs previous ~9 seconds)
- ✅ All 87 issues display
- ✅ Cache works on subsequent loads
- ✅ No rate limit errors

**Step 6: Document test results**

Create a note about what you observed (number of issues matched, load time, any errors).

---

## Task 5: Test Error Handling

**Files:**
- None (manual testing)

**Step 1: Test with invalid/missing GitHub token**

1. Create/edit `.env.local` file in project root
2. Set invalid token: `NEXT_PUBLIC_GITHUB_TOKEN=invalid_token_123`
3. Clear localStorage cache
4. Refresh the issues page
5. Verify:
   - Page still loads (doesn't crash)
   - Issues show with error messages
   - Console shows error logs but app remains functional

**Step 2: Restore valid token**

1. Set correct token in `.env.local` (or remove the line)
2. Restart dev server: `Ctrl+C` then `yarn dev`
3. Clear cache and refresh
4. Verify issues load correctly again

**Expected results:**
- ✅ Graceful degradation when API fails
- ✅ App doesn't crash on errors
- ✅ CSV data still displays even without GitHub data

---

## Task 6: Final Verification and Cleanup

**Files:**
- Review: `lib/github-api.ts`
- Review: Browser console and network tab

**Step 1: Review the final github-api.ts file**

Read through `lib/github-api.ts` and verify:
- No unused imports
- No commented-out code
- All functions have clear purposes
- Console.logs are helpful (not debug spam)

**Step 2: Run linter**

Run: `yarn lint`
Expected: No linting errors (or only pre-existing ones)

**Step 3: Build for production**

Run: `yarn build`
Expected: Production build succeeds

**Step 4: Final test in production mode**

```bash
yarn build
yarn start
```

Navigate to http://localhost:3000/issues and verify everything works in production mode.

**Step 5: Review changes**

Run: `git diff main` (or your base branch)
Review all changes to ensure they match the design document.

**Step 6: Final commit (if any cleanup was needed)**

If you made any cleanup changes:

```bash
git add .
git commit -m "chore: final cleanup after GitHub fetch refactor

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Success Criteria

✅ Only 2 GitHub API calls (vs previous 87)
✅ Page load time < 3 seconds (vs previous ~9 seconds)
✅ All 87 CSV issues display correctly
✅ Cache works (10-minute localStorage cache)
✅ Graceful error handling (no crashes on API failures)
✅ No rate limit errors
✅ Production build succeeds
✅ Linter passes

---

## Rollback Plan

If issues arise, revert to previous implementation:

```bash
git revert HEAD~3  # Revert last 3 commits
yarn dev
```

The old implementation will be restored with individual API calls.

---

## Next Steps

After successful implementation:
1. Monitor for rate limit errors in production
2. Consider adding rate limit display in UI
3. Consider moving to server-side API route for better security
4. Consider pre-fetching at build time for even faster loads
