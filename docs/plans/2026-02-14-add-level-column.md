# Add Issue Level Column and Filtering Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update CSV parser and UI to support the new 3-column CSV format with level field (Beginner/Intermediate/Advanced), display level as color-coded badges, and add level filtering.

**Architecture:** Parse CSV with headers using Papa.parse, add level field through the data pipeline (IssueRow → EnrichedIssue), extend filtering logic to support level filtering, add level column with color-coded badges to the table UI.

**Tech Stack:** Next.js 15, React 18, TypeScript, Papa Parse, inline CSS

---

## Task 1: Update Type Definitions

**Files:**
- Modify: `lib/types.ts:2-6`
- Modify: `lib/types.ts:29-35`

**Step 1: Add level field to IssueRow interface**

Edit `lib/types.ts`:

```typescript
// CSV row format: {row_number}→{repo},{level},{issue_id}
export interface IssueRow {
  rowNumber: number
  repository: string
  level: string
  issueId: number
}
```

**Step 2: Add level field to EnrichedIssue interface**

Edit `lib/types.ts`:

```typescript
// Combined data: CSV + GitHub metadata
export interface EnrichedIssue {
  rowNumber: number
  repository: string
  level: string
  issueId: number
  githubData?: GitHubIssue
  error?: string
}
```

**Step 3: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: No type errors

**Step 4: Commit type changes**

```bash
git add lib/types.ts
git commit -m "feat: add level field to IssueRow and EnrichedIssue types

Add level field to support new CSV format with difficulty levels
(Beginner/Intermediate/Advanced).

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Update CSV Parser

**Files:**
- Modify: `lib/csv-parser.ts:14-39`

**Step 1: Update Papa.parse to use header mode**

Edit `lib/csv-parser.ts` - change the Papa.parse call:

```typescript
Papa.parse<Record<string, string>>(csvText, {
  header: true,  // Parse first row as column headers
  complete: (results) => {
    try {
      const issues: IssueRow[] = results.data
        .map((row, index) => {
          // Skip empty rows
          if (!row || !row.repo) {
            return null
          }

          // Format: repo,level,issueId (with header row)
          const repository = row.repo?.trim()
          const level = row.level?.trim()
          const issueId = parseInt(row.issueId?.trim() || '0', 10)

          if (!repository || !level || !issueId) {
            console.warn(`Skipping invalid row ${index + 2}:`, row)
            return null
          }

          // Validate level value
          const validLevels = ['Beginner', 'Intermediate', 'Advanced']
          if (!validLevels.includes(level)) {
            console.warn(`Unexpected level value "${level}" at row ${index + 2}`)
          }

          return {
            rowNumber: index + 2, // +2 because header is row 1, and 0-indexed
            repository,
            level,
            issueId,
          }
        })
        .filter((issue): issue is IssueRow => issue !== null)

      // Remove duplicates based on repository + issueId combination
      const seen = new Set<string>()
      const uniqueIssues = issues.filter(issue => {
        const key = `${issue.repository}:${issue.issueId}`
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })

      resolve(uniqueIssues)
    } catch (error) {
      reject(error)
    }
  },
  error: (error: unknown) => {
    reject(error)
  },
  skipEmptyLines: true,
})
```

**Step 2: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: No type errors

**Step 3: Test the parser manually**

Run: `yarn dev` (should already be running)
Open: http://localhost:3000/issues
Expected: Issues load without errors, check browser console for no warnings

**Step 4: Commit parser changes**

```bash
git add lib/csv-parser.ts
git commit -m "feat: update CSV parser to support 3-column format with headers

- Parse CSV with header row using Papa.parse header mode
- Extract repo, level, issueId from named columns
- Add validation for level values
- Update row numbering to account for header row

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Update Filtering Logic

**Files:**
- Modify: `lib/filters.ts:3-8`
- Modify: `lib/filters.ts:10-46`
- Add: `lib/filters.ts:84-98` (new function)

**Step 1: Add level to FilterOptions interface**

Edit `lib/filters.ts`:

```typescript
export interface FilterOptions {
  search: string
  repository: string // 'all' | 'backstage/backstage' | 'backstage/community-plugins'
  state: string // 'all' | 'open' | 'closed'
  author: string // 'all' | specific author login
  level: string // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
}
```

**Step 2: Add level filtering to filterIssues function**

Edit `lib/filters.ts` - add level filter before the final return:

```typescript
export function filterIssues(
  issues: EnrichedIssue[],
  filters: FilterOptions
): EnrichedIssue[] {
  return issues.filter((issue) => {
    // Filter by search (title)
    if (filters.search && issue.githubData) {
      const searchLower = filters.search.toLowerCase()
      const titleLower = issue.githubData.title.toLowerCase()
      if (!titleLower.includes(searchLower)) {
        return false
      }
    }

    // Filter by repository
    if (filters.repository !== 'all') {
      if (issue.repository !== filters.repository) {
        return false
      }
    }

    // Filter by state
    if (filters.state !== 'all' && issue.githubData) {
      if (issue.githubData.state !== filters.state) {
        return false
      }
    }

    // Filter by author
    if (filters.author !== 'all' && issue.githubData) {
      if (issue.githubData.user.login !== filters.author) {
        return false
      }
    }

    // Filter by level
    if (filters.level !== 'all') {
      if (issue.level !== filters.level) {
        return false
      }
    }

    return true
  })
}
```

**Step 3: Add getUniqueLevels function**

Edit `lib/filters.ts` - add after getUniqueRepositories:

```typescript
export function getUniqueLevels(issues: EnrichedIssue[]): string[] {
  const levels = new Set<string>()

  issues.forEach((issue) => {
    if (issue.level) {
      levels.add(issue.level)
    }
  })

  // Sort by difficulty order, not alphabetically
  const levelOrder = ['Beginner', 'Intermediate', 'Advanced']
  return Array.from(levels).sort((a, b) =>
    levelOrder.indexOf(a) - levelOrder.indexOf(b)
  )
}
```

**Step 4: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: No type errors

**Step 5: Commit filtering changes**

```bash
git add lib/filters.ts
git commit -m "feat: add level filtering support

- Add level field to FilterOptions interface
- Add level filtering logic to filterIssues function
- Add getUniqueLevels helper sorted by difficulty order

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Update IssueTable Component

**Files:**
- Modify: `components/IssueTable.tsx:4-6`
- Modify: `components/IssueTable.tsx:14-19`
- Modify: `components/IssueTable.tsx:22-23`
- Modify: `components/IssueTable.tsx:43-157`
- Modify: `components/IssueTable.tsx:183-191`
- Modify: `components/IssueTable.tsx:194-279`
- Add: `components/IssueTable.tsx:321-331` (new helper function)

**Step 1: Import getUniqueLevels**

Edit `components/IssueTable.tsx`:

```typescript
import { filterIssues, getUniqueAuthors, getUniqueRepositories, getUniqueLevels } from '@/lib/filters'
```

**Step 2: Add level to filter state**

Edit `components/IssueTable.tsx`:

```typescript
const [filters, setFilters] = useState<FilterOptions>({
  search: '',
  repository: initialRepository || 'all',
  state: 'all',
  author: 'all',
  level: 'all',
})
```

**Step 3: Add uniqueLevels memo**

Edit `components/IssueTable.tsx` - add after uniqueRepositories:

```typescript
const uniqueLevels = useMemo(() => getUniqueLevels(issues), [issues])
```

**Step 4: Add level filter dropdown**

Edit `components/IssueTable.tsx` - add after Repository filter, before State filter:

```typescript
<div>
  <label
    htmlFor="level"
    style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--bui-fg-primary, #000)',
    }}
  >
    Level
  </label>
  <select
    id="level"
    value={filters.level}
    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
    style={{ ...inputStyle, width: '100%' }}
  >
    <option value="all">All</option>
    {uniqueLevels.map((level) => (
      <option key={level} value={level}>
        {level}
      </option>
    ))}
  </select>
</div>
```

**Step 5: Add Level column header**

Edit `components/IssueTable.tsx` - add after Repository header:

```typescript
<thead>
  <tr style={{ background: 'var(--bui-bg-info, #dbeafe)' }}>
    <th style={thStyle}>Row #</th>
    <th style={thStyle}>Repository</th>
    <th style={thStyle}>Level</th>
    <th style={thStyle}>Issue #</th>
    <th style={thStyle}>Title</th>
    <th style={thStyle}>State</th>
    <th style={thStyle}>Author</th>
    <th style={thStyle}>Labels</th>
  </tr>
</thead>
```

**Step 6: Add Level column data**

Edit `components/IssueTable.tsx` - add after Repository column:

```typescript
<td style={tdStyle}>
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      ...getLevelBadgeColor(issue.level),
    }}
  >
    {issue.level}
  </span>
</td>
```

**Step 7: Add getLevelBadgeColor helper function**

Edit `components/IssueTable.tsx` - add after getContrastColor:

```typescript
// Helper to get badge colors for level
function getLevelBadgeColor(level: string): { background: string; color: string } {
  switch (level) {
    case 'Beginner':
      return { background: '#d4edda', color: '#155724' }
    case 'Intermediate':
      return { background: '#dbeafe', color: '#1e40af' }
    case 'Advanced':
      return { background: '#fed7aa', color: '#c2410c' }
    default:
      return { background: '#e5e7eb', color: '#374151' }
  }
}
```

**Step 8: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: No type errors

**Step 9: Test the UI**

With dev server running:
1. Open: http://localhost:3000/issues
2. Verify level column appears with color-coded badges
3. Verify level filter dropdown appears
4. Test filtering by each level (Beginner, Intermediate, Advanced, All)
5. Test combining level filter with other filters
6. Check browser console for errors

Expected: All filters work correctly, badges display with proper colors

**Step 10: Commit IssueTable changes**

```bash
git add components/IssueTable.tsx
git commit -m "feat: add level column and filter to issues table

- Add level filter dropdown sorted by difficulty
- Add level column with color-coded badges
- Beginner: green, Intermediate: blue, Advanced: orange
- Import and use getUniqueLevels helper

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Manual Testing and Verification

**Files:**
- Verify: All components work together

**Step 1: Test complete data flow**

With dev server running, perform these tests:

1. **Load Issues Page**
   - Navigate to: http://localhost:3000/issues
   - Verify: Issues load successfully
   - Verify: Level column displays with color-coded badges
   - Verify: Level filter dropdown shows Beginner, Intermediate, Advanced

2. **Test Level Filter**
   - Filter by: Beginner
   - Verify: Only Beginner issues show
   - Filter by: Intermediate
   - Verify: Only Intermediate issues show
   - Filter by: Advanced
   - Verify: Only Advanced issues show
   - Filter by: All
   - Verify: All issues show

3. **Test Combined Filters**
   - Set Repository: backstage/backstage
   - Set Level: Beginner
   - Verify: Only backstage/backstage Beginner issues show
   - Add Search: "test"
   - Verify: Further filtered by title search

4. **Test Badge Colors**
   - Verify Beginner badges: Green background (#d4edda), dark green text (#155724)
   - Verify Intermediate badges: Blue background (#dbeafe), dark blue text (#1e40af)
   - Verify Advanced badges: Orange background (#fed7aa), dark orange text (#c2410c)

5. **Check Browser Console**
   - Verify: No errors or warnings
   - Verify: CSV parsing completes successfully

**Step 2: Verify TypeScript and linting**

Run: `yarn tsc --noEmit && yarn lint`
Expected: No errors or warnings

**Step 3: Check git status**

Run: `git status`
Expected: Clean working tree (all changes committed)

**Step 4: Review commit history**

Run: `git log --oneline -5`
Expected: Four commits for this feature:
1. Type definitions
2. CSV parser
3. Filtering logic
4. IssueTable UI

---

## Summary

**Commits:** 4 total
1. Add level field to types
2. Update CSV parser for 3-column format with headers
3. Add level filtering support
4. Add level column and filter to UI

**Testing:** Manual testing in browser + TypeScript compilation

**Files Modified:** 3
- `lib/types.ts`
- `lib/csv-parser.ts`
- `lib/filters.ts`
- `components/IssueTable.tsx`

**No Breaking Changes:** Existing functionality preserved, new feature added

---

## Related Skills

- @superpowers:verification-before-completion - Use before claiming work complete
- @superpowers:systematic-debugging - Use if tests fail or bugs appear
- @superpowers:test-driven-development - Consider for future test coverage
