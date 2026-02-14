# Design: Always Show Issue Links

**Date:** 2026-02-14
**Status:** Approved

## Problem Statement

The issues table currently only shows clickable links for the Issue # column when GitHub API data is available. When GitHub data is missing (due to API errors, rate limits, or deleted issues), the issue number displays as plain text, preventing users from navigating to GitHub.

However, we have sufficient information in the CSV data (repository and issueId) to construct valid GitHub issue URLs without requiring API data.

## Requirements

- Issue # column should always display as a clickable link
- Links should work regardless of GitHub API data availability
- Visual styling should remain consistent (no indication of missing GitHub data)
- Title column remains non-clickable when GitHub data is unavailable

## Solution: Approach 1 - Always Construct from CSV Data

Construct GitHub URLs directly from CSV data for all issues using the format:
```
https://github.com/{repository}/issues/{issueId}
```

### Architecture

**Scope:** Minimal change to `components/IssueTable.tsx`
**File modified:** `components/IssueTable.tsx` (lines 248-263)
**Change type:** Single JSX block update in table cell rendering

### Implementation

Replace conditional rendering with straightforward link construction:

**Before:**
```tsx
<td style={tdStyle}>
  {issue.githubData ? (
    <a
      href={issue.githubData.html_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: 'var(--bui-bg-solid, #1f5493)',
        fontWeight: 500,
      }}
    >
      #{issue.issueId}
    </a>
  ) : (
    `#${issue.issueId}`
  )}
</td>
```

**After:**
```tsx
<td style={tdStyle}>
  <a
    href={`https://github.com/${issue.repository}/issues/${issue.issueId}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: 'var(--bui-bg-solid, #1f5493)',
      fontWeight: 500,
    }}
  >
    #{issue.issueId}
  </a>
</td>
```

**Key changes:**
- Remove conditional based on `issue.githubData`
- Always render `<a>` tag
- Construct URL using template literal from CSV data
- Maintain existing styling (blue link, font weight 500)

### Data Flow

1. **Input:** `EnrichedIssue` object provides:
   - `repository`: e.g., "backstage/backstage"
   - `issueId`: e.g., 31750

2. **URL Construction:**
   - Template: `https://github.com/${repository}/issues/${issueId}`
   - Example: `https://github.com/backstage/backstage/issues/31750`

3. **Rendering:**
   - Always displays as clickable link
   - Opens in new tab (`target="_blank"`)
   - Consistent visual appearance

**No changes required to:**
- Data fetching logic (`useIssues` hook)
- Type definitions (`EnrichedIssue` interface)
- Other table columns

### Testing & Verification

**Test Scenarios:**
1. Issues with GitHub data - verify link works correctly
2. Issues without GitHub data - verify link is still clickable and functional
3. Both repositories - test `backstage/backstage` and `backstage/community-plugins`

**Manual Verification:**
1. Start dev server
2. Navigate to `/issues` page
3. Click issue numbers (with and without loaded GitHub data)
4. Confirm all links open correct GitHub issue pages

**Expected Behavior:**
- All issue numbers appear as blue, clickable links
- Clicking any link opens the corresponding GitHub issue in new tab
- No plain-text or broken issue numbers

## Rationale

**Why always construct from CSV data:**
- Simpler implementation (removes conditional logic)
- Single source of truth for URL construction
- GitHub issue URLs follow predictable format
- No benefit to using `githubData.html_url` (URLs are identical)
- Works 100% of the time regardless of API availability

**Rejected alternatives:**
- Fallback approach (unnecessary complexity)
- Utility function (over-engineering for single use case)
- Different styling for missing data (adds visual noise)

## Impact

**User Experience:**
- All issues now linkable, improving navigation
- Consistent behavior across all issues
- No visual changes to successful API responses

**Code Quality:**
- Simplified rendering logic
- Fewer conditionals
- More predictable behavior

**Maintenance:**
- Less code to maintain
- No additional files or utilities needed
- Easy to understand and modify
