# GitHub Issue Fetching Refactor - Design Document

**Date:** 2026-02-14
**Status:** Approved
**Author:** Claude Code

## Problem Statement

The current implementation fetches GitHub issue metadata by making individual API calls for each of the 87 issues in `issues.csv`. This approach:
- Makes 87 sequential API calls with 100ms delays (~9 seconds)
- Causes rate limit errors when cache expires
- Provides poor user experience during data refresh
- Is inefficient and doesn't scale

## Goals

1. Reduce GitHub API calls from 87 to 2 (43x improvement)
2. Eliminate rate limit errors under normal usage
3. Maintain existing functionality (CSV as source of truth, caching, graceful degradation)
4. Improve initial load time from ~9 seconds to ~2-3 seconds

## Solution: Bulk Fetch with GitHub Issues List API

### Architecture

**Files to modify:**
1. `lib/github-api.ts` - Replace individual fetching with bulk list API
2. `hooks/useIssues.ts` - Minimal updates to use new API functions
3. `lib/types.ts` - No changes needed

**New data flow:**
```
CSV (87 issues)
    ↓
Parse CSV → IssueRow[]
    ↓
Bulk fetch from GitHub (2 API calls)
    ↓
Build lookup map: Map<"repo/issueId", GitHubIssue>
    ↓
Merge CSV with GitHub data → EnrichedIssue[]
    ↓
Cache & display
```

### Implementation Details

#### Step 1: Bulk Fetch GitHub Issues

Make 2 API calls using the GitHub Issues List API:
- `GET /repos/backstage/backstage/issues?labels=contribfest&state=all&per_page=100`
- `GET /repos/backstage/community-plugins/issues?labels=contribfest&state=all&per_page=100`

Parameters:
- `labels=contribfest` - Filter to only contribfest issues
- `state=all` - Include both open and closed issues
- `per_page=100` - Maximize results per page (handle pagination if needed)

Each call returns an array of full GitHub issue objects with all metadata.

#### Step 2: Build Lookup Map

Create a map for O(1) lookups:
```typescript
Map<string, GitHubIssue>
// Key format: "backstage/backstage#31750"
// Value: Full GitHub issue object
```

This allows efficient matching of CSV entries with GitHub data.

#### Step 3: Merge with CSV Data

For each CSV row:
1. Build lookup key: `${repository}#${issueId}`
2. Check map for matching GitHub data
3. If found: create `EnrichedIssue` with both CSV level and GitHub metadata
4. If not found: create `EnrichedIssue` with CSV data only (`githubData: undefined`)

**Result:** All 87 CSV issues appear in final list, whether or not GitHub data was found.

#### Caching Strategy

Keep existing 10-minute localStorage cache. The bulk fetch is fast enough (~2-3 seconds) that cache refresh won't impact user experience.

### Error Handling

**Network failures:**
- If bulk API call fails, log error and continue
- Issues from failed repo appear with blank GitHub data (graceful degradation)
- Show user-friendly error message in UI

**Rate limit handling:**
- Much less critical with only 2 API calls
- Check response headers for rate limit info
- If rate limited, cache serves stale data until limit resets
- Display helpful error: "Rate limited. Try again in X minutes"

**Pagination:**
- Check response `Link` header for `rel="next"`
- Fetch all pages if needed (unlikely: would need >100 issues per repo)

**Partial success:**
- If one repo succeeds and one fails, show available data
- Better than current approach where any failure blocks everything

**CSV entries without matches:**
- Display with blank GitHub columns (same as current failed fetches)
- Indicates issue may no longer have contribfest label or was deleted

### Testing & Verification

**Manual testing:**
1. Clear localStorage cache
2. Load issues page and verify:
   - Network tab shows only 2 GitHub API calls
   - Loading completes in ~2-3 seconds
   - All 87 issues render correctly
3. Refresh page → instant load from cache
4. Wait 10 minutes, refresh → new fetch occurs
5. Test offline → cache serves stale data gracefully

**Success criteria:**
- ✅ All 87 CSV issues display in table
- ✅ Issues with GitHub data show full metadata
- ✅ Issues without GitHub matches show CSV data with blank columns
- ✅ Initial load < 3 seconds (vs current ~9 seconds)
- ✅ No rate limit errors under normal usage
- ✅ Cache works (subsequent loads instant)

**Edge cases:**
- CSV issues without contribfest label → shown with blank GitHub data
- Closed issues → included in results
- Duplicate issue IDs in CSV → each row handled independently

## Trade-offs

**Advantages:**
- 43x reduction in API calls (87 → 2)
- Massive performance improvement
- Better rate limit handling
- Simpler code (no sequential delays needed)
- Standard API with good rate limits (5,000/hour)

**Assumptions:**
- CSV issues have contribfest label (or we accept blank GitHub data)
- <100 contribfest issues per repo (pagination rarely needed)

**Not included in scope:**
- Server-side rendering (keeping client-side approach)
- Dynamic expansion beyond CSV list (CSV remains source of truth)
- Real-time updates (10-minute cache sufficient)

## Implementation Plan

Detailed implementation steps will be created in a separate implementation plan document.

## Approval

Design approved on 2026-02-14.
