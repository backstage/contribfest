# Contrib Champs Page Design

**Date:** 2026-02-14
**Status:** Implemented

## Overview

Create a new "Contrib Champs" page to celebrate contributors by displaying all merged pull requests with the `contribfest` label from the Backstage and Community Plugins repositories. The page will feature a sortable table of PRs and a right sidebar showcasing past ContribFest sessions.

## Requirements

### Page Features
- Display merged PRs from both `backstage/backstage` and `backstage/community-plugins` repositories
- Table columns: PR Number, Author, Title, Repository, Created Date
- Column sorting (click headers to sort ascending/descending)
- Default sort: Created Date descending (newest first)
- Right sidebar with cards for past ContribFest sessions

### ContribFest Sessions
Display cards for the following sessions (in order):
1. Amsterdam (March 2026)
2. Atlanta (November 2025)
3. London (April 2025)
4. Salt Lake City (November 2024)

Each card includes: location (title), date (subtitle), and link to blog post.

## Architecture & File Structure

### New Files

```
/app/contrib-champs/page.tsx          # Main page component
/components/PullRequestTable.tsx      # Sortable PR table
/components/SessionCard.tsx           # Individual session card
/components/SessionsSidebar.tsx       # Right sidebar with session cards
/hooks/usePullRequests.ts            # Hook for fetching PR data
/lib/github-pr-api.ts                # GitHub API functions for PRs
```

### Modified Files

```
/components/Sidebar.tsx               # Add "Contrib Champs" navigation link
/lib/types.ts                         # Add PR-related types
```

### Navigation Structure

Update navigationLinks array in Sidebar.tsx:
1. Welcome
2. Getting Started
3. Issues
4. Contrib Champs (new)

### Page Layout

```
┌─────────────┬──────────────────────────────┬───────────────────┐
│   Global    │                              │                   │
│   Sidebar   │      PR Table                │  Sessions         │
│             │      (sortable columns)      │  Sidebar          │
│   (Nav)     │                              │  (cards)          │
│             │                              │                   │
└─────────────┴──────────────────────────────┴───────────────────┘
```

- Main content area (flex: 1): PR table
- Right sidebar (fixed width ~300px): Session cards
- Uses Backstage UI CSS variables for consistent theming

## Components

### PullRequestTable Component

**Purpose:** Display merged PRs in a sortable table

**Features:**
- Columns: PR Number, Author, Title, Repository, Created Date
- Click column headers to sort (toggle ascending/descending)
- Default sort: Created Date descending
- PR numbers link to GitHub PR pages
- Author names link to GitHub profiles
- Loading, error, and empty states

**Props:**
```typescript
interface PullRequestTableProps {
  pullRequests: GitHubPullRequest[]
  loading: boolean
  error: string | null
}
```

**Styling:** Similar to IssueTable but simpler (no filtering)

### SessionCard Component

**Purpose:** Display a single ContribFest session

**Props:**
```typescript
interface SessionCardProps {
  location: string    // e.g., "Amsterdam"
  date: string        // e.g., "March 2026"
  blogUrl: string     // Link to blog post
}
```

**Layout:**
- Location as card title (bold, larger font)
- Date as subtitle (secondary color, smaller font)
- "View Blog Post" link/button
- Hover effects for interactivity
- Consistent with WelcomeCard styling

### SessionsSidebar Component

**Purpose:** Container for session cards on the right side

**Features:**
- Displays 4 SessionCards vertically
- Fixed width (~300px)
- Sticky positioning (stays visible when scrolling)
- Header: "Past ContribFest Sessions"
- Appropriate spacing between cards

**Props:**
```typescript
interface SessionsSidebarProps {
  sessions: ContribFestSession[]
}
```

### Page Component (page.tsx)

**Layout:**
- Flex container with main content and SessionsSidebar
- Page title: "Contrib Champs"
- Description explaining the page purpose
- Main area: PullRequestTable
- Right area: SessionsSidebar

## Data Flow

### GitHub API Integration

**New file:** `/lib/github-pr-api.ts`

**Function:** `fetchContribfestPullRequests(owner: string, repo: string)`

**Behavior:**
- Fetches closed PRs with `contribfest` label
- API endpoint: `GET /repos/{owner}/{repo}/pulls?state=closed&per_page=100`
- Filters to only merged PRs (check `merged_at !== null`)
- Supports pagination (fetch all pages)
- Uses same auth pattern as existing code (NEXT_PUBLIC_GITHUB_TOKEN)

**Repositories to fetch:**
- `backstage/backstage`
- `backstage/community-plugins`

### Data Types

**Add to `/lib/types.ts`:**

```typescript
export interface GitHubPullRequest {
  number: number
  title: string
  state: string
  html_url: string
  user: {
    login: string
    html_url: string
  }
  created_at: string
  merged_at: string | null
  repository: string  // Added during processing
}

export interface ContribFestSession {
  location: string
  date: string
  blogUrl: string
}
```

### usePullRequests Hook

**New file:** `/hooks/usePullRequests.ts`

**Purpose:** Manage PR fetching and state

**Return value:**
```typescript
{
  pullRequests: GitHubPullRequest[]
  loading: boolean
  error: string | null
  refresh: () => void
}
```

**Behavior:**
- Fetches PRs on mount from both repositories
- Combines results and sorts by created_at (newest first)
- Manages loading/error states
- Provides refresh function for manual reload

### Session Data

**Implementation:** Hardcoded array in page component

```javascript
const sessions: ContribFestSession[] = [
  { location: 'Amsterdam', date: 'March 2026', blogUrl: '#' },
  { location: 'Atlanta', date: 'November 2025', blogUrl: '#' },
  { location: 'London', date: 'April 2025', blogUrl: '#' },
  { location: 'Salt Lake City', date: 'November 2024', blogUrl: '#' }
]
```

**Note:** Placeholder URLs (`#`) can be updated with real blog post URLs later.

## Error Handling

### API Error Handling

- **Repository fetch failure:** If one repo fails, continue with the other (partial results better than none)
- **Rate limiting:** Display user-friendly message suggesting GitHub token configuration
- **Network errors:** Show error message with "Retry" button
- **Merged PR filtering:** Silently exclude non-merged PRs (only show merged ones)

### Component Error States

**PullRequestTable:**
- **Loading:** Show spinner with "Loading pull requests..."
- **Error:** Display error message with retry button
- **Empty:** Show "No merged pull requests found with the contribfest label"

**SessionCard links:**
- Placeholder URLs (`#`) are safe - won't break navigation
- External links include `rel="noopener noreferrer"`

### Hook Error Recovery

- Expose errors via hook return value
- Allow user to retry via refresh function
- Log errors to console for debugging
- Show user-friendly messages in UI

### Graceful Degradation

- PR data failure doesn't break session cards
- One repo failure doesn't prevent showing the other repo's PRs
- Page structure remains intact with data failures

## Testing & Verification

### Data Fetching Tests

- [ ] PRs fetched from both repositories
- [ ] Only merged PRs displayed (all have merged_at date)
- [ ] Works with and without GitHub token
- [ ] Pagination works for >100 PRs

### Table Functionality Tests

- [ ] Column sorting works (each column, ascending/descending)
- [ ] Default sort is Created Date descending
- [ ] PR number links work correctly
- [ ] Author name links work correctly
- [ ] Repository column shows correct values

### Layout & Styling Tests

- [ ] Right sidebar displays with session cards
- [ ] Theme toggle works (light/dark mode)
- [ ] Styling consistent with existing pages
- [ ] Responsive behavior acceptable

### Session Cards Tests

- [ ] All 4 sessions display in correct order
- [ ] Card styling and hover effects work
- [ ] Blog links function (even if placeholders)

### Error State Tests

- [ ] API failure shows error message
- [ ] Empty state displays correctly
- [ ] Loading state shows before data loads

### Navigation Tests

- [ ] "Contrib Champs" link appears in sidebar
- [ ] Page accessible at `/contrib-champs`
- [ ] Navigation between pages works

### Browser Tests

- [ ] Chrome works without errors
- [ ] Firefox works without errors
- [ ] No console errors

## Implementation Approach

**Rationale for Approach 1 (Dedicated Page with Specialized Components):**

This approach was chosen because:
1. Clean separation of concerns (PRs vs Issues)
2. Consistent with existing codebase architecture patterns
3. PRs and Issues are different enough to warrant separate handling
4. Easier to maintain and extend independently
5. Can optimize PR fetching without affecting issues page

**Trade-offs:** More initial code but better long-term maintainability.

## Future Enhancements

Potential additions for later (not in initial implementation):
- Filter by repository (Backstage vs Community Plugins)
- Search functionality
- Display merge date in addition to created date
- Link to contributor profiles
- Statistics (total PRs, unique contributors, etc.)
- Update session data with real dates and blog URLs
