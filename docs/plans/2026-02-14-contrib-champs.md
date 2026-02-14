# Contrib Champs Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a new Contrib Champs page displaying merged PRs with the contribfest label and past ContribFest session cards.

**Architecture:** New Next.js app route at `/contrib-champs` with dedicated components. Fetches merged PRs from GitHub API (both backstage/backstage and backstage/community-plugins). Right sidebar displays ContribFest session cards. Main content area shows sortable PR table.

**Tech Stack:** Next.js 15 (App Router), TypeScript, React 18, @backstage/ui, GitHub REST API

---

## Task 1: Add PR Types

**Goal:** Define TypeScript types for pull request data and session data.

**Files:**
- Modify: `lib/types.ts` (append to end of file)

**Step 1: Add PR and session types**

Add to end of `lib/types.ts`:

```typescript
// GitHub API pull request response
export interface GitHubPullRequest {
  id: number
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
  repository: string  // Added during processing to identify source repo
}

// ContribFest session information
export interface ContribFestSession {
  location: string
  date: string
  blogUrl: string
}
```

**Step 2: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add GitHubPullRequest and ContribFestSession types

Add types for PR data and ContribFest session information.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create GitHub PR API Functions

**Goal:** Implement functions to fetch merged pull requests with contribfest label from GitHub.

**Files:**
- Create: `lib/github-pr-api.ts`

**Step 1: Create API file with fetch function**

Create `lib/github-pr-api.ts`:

```typescript
import type { GitHubPullRequest } from './types'

const GITHUB_API_BASE = 'https://api.github.com'

export async function fetchContribfestPullRequests(
  owner: string,
  repo: string
): Promise<GitHubPullRequest[]> {
  const allPRs: GitHubPullRequest[] = []
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
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=closed&per_page=${perPage}&page=${page}`

      const response = await fetch(url, {
        headers,
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error(
          `Failed to fetch PRs from ${owner}/${repo}: ${response.status} ${response.statusText}`
        )
        break
      }

      const prs = await response.json() as GitHubPullRequest[]

      if (prs.length === 0) {
        break
      }

      // Filter to only merged PRs with contribfest label
      const mergedContribfestPRs = prs.filter(pr => {
        const hasContribfestLabel = pr.labels?.some((label: any) =>
          label.name === 'contribfest'
        )
        return pr.merged_at !== null && hasContribfestLabel
      })

      // Add repository identifier
      mergedContribfestPRs.forEach(pr => {
        pr.repository = `${owner}/${repo}`
      })

      allPRs.push(...mergedContribfestPRs)

      // If we got fewer than perPage results, we've reached the end
      if (prs.length < perPage) {
        break
      }

      page++
    }

    console.log(`Fetched ${allPRs.length} merged contribfest PRs from ${owner}/${repo}`)
    return allPRs
  } catch (error) {
    console.error(`Error fetching PRs from ${owner}/${repo}:`, error)
    return []
  }
}

export async function fetchAllContribfestPullRequests(): Promise<GitHubPullRequest[]> {
  console.log('Fetching contribfest PRs from GitHub...')

  const [backstagePRs, communityPluginsPRs] = await Promise.all([
    fetchContribfestPullRequests('backstage', 'backstage'),
    fetchContribfestPullRequests('backstage', 'community-plugins'),
  ])

  const allPRs = [...backstagePRs, ...communityPluginsPRs]

  // Sort by created_at descending (newest first)
  allPRs.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  console.log(`Total merged contribfest PRs: ${allPRs.length}`)
  return allPRs
}
```

**Step 2: Fix type issue with labels**

Update the GitHubPullRequest type in `lib/types.ts` to include labels:

```typescript
export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  state: string
  html_url: string
  user: {
    login: string
    html_url: string
  }
  labels?: Array<{
    name: string
    color: string
  }>
  created_at: string
  merged_at: string | null
  repository: string
}
```

**Step 3: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 4: Commit**

```bash
git add lib/github-pr-api.ts lib/types.ts
git commit -m "feat: add GitHub PR API functions

Implement functions to fetch merged PRs with contribfest label from
both backstage/backstage and backstage/community-plugins repos.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create usePullRequests Hook

**Goal:** Create a custom hook to manage PR fetching state.

**Files:**
- Create: `hooks/usePullRequests.ts`

**Step 1: Create hook file**

Create `hooks/usePullRequests.ts`:

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GitHubPullRequest } from '@/lib/types'
import { fetchAllContribfestPullRequests } from '@/lib/github-pr-api'

interface UsePullRequestsReturn {
  pullRequests: GitHubPullRequest[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function usePullRequests(): UsePullRequestsReturn {
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPRs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const prs = await fetchAllContribfestPullRequests()
      setPullRequests(prs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pull requests'
      setError(errorMessage)
      console.error('Error fetching PRs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPRs()
  }, [fetchPRs])

  const refresh = useCallback(() => {
    fetchPRs()
  }, [fetchPRs])

  return {
    pullRequests,
    loading,
    error,
    refresh,
  }
}
```

**Step 2: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add hooks/usePullRequests.ts
git commit -m "feat: add usePullRequests hook

Create custom hook for fetching and managing PR state.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create PullRequestTable Component

**Goal:** Build a sortable table component to display pull requests.

**Files:**
- Create: `components/PullRequestTable.tsx`

**Step 1: Create table component**

Create `components/PullRequestTable.tsx`:

```typescript
'use client'

import { useState, useMemo } from 'react'
import type { GitHubPullRequest } from '@/lib/types'

interface PullRequestTableProps {
  pullRequests: GitHubPullRequest[]
}

type SortField = 'number' | 'author' | 'title' | 'repository' | 'created_at'
type SortDirection = 'asc' | 'desc'

export function PullRequestTable({ pullRequests }: PullRequestTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedPRs = useMemo(() => {
    const sorted = [...pullRequests]

    sorted.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'number':
          aValue = a.number
          bValue = b.number
          break
        case 'author':
          aValue = a.user.login.toLowerCase()
          bValue = b.user.login.toLowerCase()
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'repository':
          aValue = a.repository.toLowerCase()
          bValue = b.repository.toLowerCase()
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

    return sorted
  }, [pullRequests, sortField, sortDirection])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div
      style={{
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr
            style={{
              background: 'var(--bui-bg-app, #f8f8f8)',
              borderBottom: '1px solid var(--bui-border-1, #d5d5d5)',
            }}
          >
            <th
              onClick={() => handleSort('number')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              PR #{getSortIndicator('number')}
            </th>
            <th
              onClick={() => handleSort('author')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Author{getSortIndicator('author')}
            </th>
            <th
              onClick={() => handleSort('title')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Title{getSortIndicator('title')}
            </th>
            <th
              onClick={() => handleSort('repository')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Repository{getSortIndicator('repository')}
            </th>
            <th
              onClick={() => handleSort('created_at')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Created{getSortIndicator('created_at')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPRs.map((pr, index) => (
            <tr
              key={pr.id}
              style={{
                borderBottom: '1px solid var(--bui-border-1, #d5d5d5)',
                background:
                  index % 2 === 0
                    ? 'var(--bui-bg-popover, #fff)'
                    : 'var(--bui-bg-app, #f8f8f8)',
              }}
            >
              <td style={{ padding: '12px 16px' }}>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--bui-bg-solid, #1f5493)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  #{pr.number}
                </a>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <a
                  href={pr.user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--bui-fg-primary, #000)',
                    textDecoration: 'none',
                  }}
                >
                  {pr.user.login}
                </a>
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  color: 'var(--bui-fg-primary, #000)',
                }}
              >
                {pr.title}
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  color: 'var(--bui-fg-secondary, #666)',
                  fontSize: '13px',
                }}
              >
                {pr.repository}
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  color: 'var(--bui-fg-secondary, #666)',
                  fontSize: '13px',
                }}
              >
                {formatDate(pr.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedPRs.length === 0 && (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            color: 'var(--bui-fg-secondary, #666)',
          }}
        >
          No merged pull requests found with the contribfest label.
        </div>
      )}
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add components/PullRequestTable.tsx
git commit -m "feat: add PullRequestTable component

Create sortable table component for displaying pull requests with
columns for PR number, author, title, repository, and created date.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create SessionCard Component

**Goal:** Build a card component for displaying ContribFest session information.

**Files:**
- Create: `components/SessionCard.tsx`

**Step 1: Create SessionCard component**

Create `components/SessionCard.tsx`:

```typescript
import type { ContribFestSession } from '@/lib/types'

interface SessionCardProps {
  session: ContribFestSession
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <div
      style={{
        background: 'var(--bui-bg-popover, #fff)',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '8px',
        padding: '16px',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-bg-solid, #1f5493)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-border-1, #d5d5d5)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '4px',
          color: 'var(--bui-fg-primary, #000)',
        }}
      >
        {session.location}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--bui-fg-secondary, #666)',
          marginBottom: '12px',
        }}
      >
        {session.date}
      </p>
      <a
        href={session.blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          fontSize: '14px',
          color: 'var(--bui-bg-solid, #1f5493)',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        View Blog Post →
      </a>
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add components/SessionCard.tsx
git commit -m "feat: add SessionCard component

Create card component for displaying ContribFest session info with
location, date, and blog post link.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create SessionsSidebar Component

**Goal:** Build a container component for displaying session cards.

**Files:**
- Create: `components/SessionsSidebar.tsx`

**Step 1: Create SessionsSidebar component**

Create `components/SessionsSidebar.tsx`:

```typescript
import { SessionCard } from './SessionCard'
import type { ContribFestSession } from '@/lib/types'

interface SessionsSidebarProps {
  sessions: ContribFestSession[]
}

export function SessionsSidebar({ sessions }: SessionsSidebarProps) {
  return (
    <aside
      style={{
        width: '300px',
        marginLeft: '32px',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '32px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Past ContribFest Sessions
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {sessions.map((session) => (
            <SessionCard key={session.location} session={session} />
          ))}
        </div>
      </div>
    </aside>
  )
}
```

**Step 2: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add components/SessionsSidebar.tsx
git commit -m "feat: add SessionsSidebar component

Create sidebar container for displaying ContribFest session cards
with sticky positioning.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Create Contrib Champs Page

**Goal:** Build the main page component that brings everything together.

**Files:**
- Create: `app/contrib-champs/page.tsx`

**Step 1: Create page component**

Create `app/contrib-champs/page.tsx`:

```typescript
'use client'

import { usePullRequests } from '@/hooks/usePullRequests'
import { PullRequestTable } from '@/components/PullRequestTable'
import { SessionsSidebar } from '@/components/SessionsSidebar'
import type { ContribFestSession } from '@/lib/types'

const sessions: ContribFestSession[] = [
  {
    location: 'Amsterdam',
    date: 'March 2026',
    blogUrl: '#',
  },
  {
    location: 'Atlanta',
    date: 'November 2025',
    blogUrl: '#',
  },
  {
    location: 'London',
    date: 'April 2025',
    blogUrl: '#',
  },
  {
    location: 'Salt Lake City',
    date: 'November 2024',
    blogUrl: '#',
  },
]

export default function ContribChampsPage() {
  const { pullRequests, loading, error, refresh } = usePullRequests()

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                margin: 0,
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Contrib Champs
            </h1>
            <button
              onClick={refresh}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: 'var(--bui-bg-app, #f8f8f8)',
                border: '1px solid var(--bui-border-1, #d5d5d5)',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--bui-fg-primary, #000)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'var(--bui-bg-info, #dbeafe)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bui-bg-app, #f8f8f8)'
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Celebrating contributors! Browse merged pull requests with the contribfest label
            from Backstage and Community Plugins repositories.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              background: 'var(--bui-bg-app, #f8f8f8)',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Loading pull requests...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              Error Loading Pull Requests
            </div>
            <div style={{ fontSize: '14px' }}>{error}</div>
          </div>
        )}

        {/* Pull Request Table */}
        {!loading && !error && <PullRequestTable pullRequests={pullRequests} />}
      </div>

      {/* Sessions Sidebar */}
      <SessionsSidebar sessions={sessions} />
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `yarn build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Test in browser**

Run: `yarn dev`
Navigate to: `http://localhost:3000/contrib-champs`
Expected: Page loads, shows loading state, then displays PR table and session cards

**Step 4: Commit**

```bash
git add app/contrib-champs/page.tsx
git commit -m "feat: add Contrib Champs page

Create main page component with PR table and sessions sidebar.
Displays merged PRs with contribfest label and past ContribFest
session cards.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add Navigation Link

**Goal:** Add Contrib Champs to the sidebar navigation.

**Files:**
- Modify: `components/Sidebar.tsx:8-12`

**Step 1: Add navigation link**

In `components/Sidebar.tsx`, update the navigationLinks array (around line 8):

```typescript
const navigationLinks = [
  { href: '/', label: 'Welcome' },
  { href: '/getting-started/', label: 'Getting Started' },
  { href: '/issues/', label: 'Issues' },
  { href: '/contrib-champs/', label: 'Contrib Champs' },
]
```

**Step 2: Verify in browser**

Run: `yarn dev`
Expected: "Contrib Champs" link appears in sidebar navigation
Click link to verify it navigates to the new page

**Step 3: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: add Contrib Champs to navigation

Add navigation link for Contrib Champs page to sidebar menu.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Final Testing & Verification

**Goal:** Comprehensive testing of all features.

**Step 1: Test data fetching**

1. Navigate to `/contrib-champs`
2. Verify loading state appears
3. Wait for PRs to load
4. Check console for API responses
5. Verify merged PRs from both repos appear

**Step 2: Test table sorting**

1. Click "PR #" header - verify sort by number
2. Click again - verify direction toggles
3. Test each column (Author, Title, Repository, Created)
4. Verify sort indicator (↑/↓) appears correctly
5. Verify default sort is Created Date descending

**Step 3: Test links**

1. Click a PR number - verify opens GitHub PR in new tab
2. Click an author name - verify opens GitHub profile
3. Click "View Blog Post" on session cards - verify links work (even if placeholders)

**Step 4: Test error handling**

1. Disconnect network
2. Click refresh button
3. Verify error message displays
4. Reconnect network
5. Click refresh again - verify data loads

**Step 5: Test theme toggle**

1. Click theme toggle in sidebar
2. Verify light/dark mode works for:
   - PR table
   - Session cards
   - Page header
3. Toggle back to original theme

**Step 6: Test responsive layout**

1. Verify sidebar stays on right
2. Check that layout looks good at different viewport widths
3. Verify sticky positioning of sessions sidebar

**Step 7: Browser compatibility**

1. Test in Chrome - verify no console errors
2. Test in Firefox - verify no console errors

**Step 8: Final commit if any fixes needed**

If bugs found and fixed:
```bash
git add [files]
git commit -m "fix: [description of fixes]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Update Design Document Status

**Goal:** Mark design document as implemented.

**Files:**
- Modify: `docs/plans/2026-02-14-contrib-champs-design.md:3`

**Step 1: Update status**

Change line 3 in design document from:
```markdown
**Status:** Approved
```

To:
```markdown
**Status:** Implemented
```

**Step 2: Commit**

```bash
git add docs/plans/2026-02-14-contrib-champs-design.md
git commit -m "docs: mark Contrib Champs design as implemented

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Completion Checklist

- [ ] All types defined in `lib/types.ts`
- [ ] GitHub PR API functions working
- [ ] `usePullRequests` hook fetches data correctly
- [ ] `PullRequestTable` displays and sorts correctly
- [ ] `SessionCard` renders with proper styling
- [ ] `SessionsSidebar` displays all sessions
- [ ] Main page at `/contrib-champs` works
- [ ] Navigation link added to sidebar
- [ ] All sorting functionality works
- [ ] All links open correctly
- [ ] Error states display properly
- [ ] Theme toggle works
- [ ] No console errors
- [ ] Design document updated

## Notes

- This project has no testing framework set up, so verification is manual via browser testing
- GitHub API rate limits: Unauthenticated = 60 requests/hour, Authenticated = 5000 requests/hour
- Consider adding `NEXT_PUBLIC_GITHUB_TOKEN` to `.env.local` for higher rate limits
- Session blog URLs are placeholders (`#`) and can be updated later with real URLs
- The page fetches data on mount and can be refreshed manually via the refresh button
