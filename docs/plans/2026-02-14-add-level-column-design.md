# Design: Add Issue Level Column and Filtering

**Date:** 2026-02-14
**Status:** Approved

## Overview

Update the pairing logic to support the new CSV structure which includes a `level` field (Beginner, Intermediate, Advanced). Display the level as a color-coded badge in the issues table and add filtering capability.

## Background

The `issues.csv` file has been updated from a 2-column format (repository, issueId) to a 3-column format with proper headers (repo, level, issueId). The level field indicates the difficulty/experience level appropriate for each issue.

## Goals

1. Parse the new 3-column CSV format correctly
2. Display issue level in the table with visual differentiation
3. Allow users to filter issues by level
4. Maintain consistency with existing UI patterns

## Architecture

### Files to Modify

1. **lib/types.ts** - Add `level` field to data interfaces
2. **lib/csv-parser.ts** - Update parser for 3-column CSV with headers
3. **lib/filters.ts** - Add level filtering logic and helper functions
4. **components/IssueTable.tsx** - Add level filter and column with badges

### Data Flow

```
CSV (repo, level, issueId)
  ↓
parseIssuesCSV() - validates and parses 3 columns
  ↓
IssueRow { repository, level, issueId }
  ↓
enrichIssuesWithGitHubData()
  ↓
EnrichedIssue { repository, level, issueId, githubData }
  ↓
filterIssues() - filters by level (and other criteria)
  ↓
IssueTable - displays level as color-coded badge
```

## Detailed Design

### 1. Type Definitions (lib/types.ts)

Update two interfaces to include the `level` field:

```typescript
export interface IssueRow {
  rowNumber: number
  repository: string
  level: string  // NEW: "Beginner" | "Intermediate" | "Advanced"
  issueId: number
}

export interface EnrichedIssue {
  rowNumber: number
  repository: string
  level: string  // NEW: "Beginner" | "Intermediate" | "Advanced"
  issueId: number
  githubData?: GitHubIssue
  error?: string
}
```

### 2. CSV Parser (lib/csv-parser.ts)

**Key changes:**
- Add `header: true` to Papa.parse options to automatically parse headers
- Access columns by name: `row.repo`, `row.level`, `row.issueId`
- Validate level values and warn if unexpected
- Update format comment to reflect new structure

**Parsing logic:**
```typescript
Papa.parse<Record<string, string>>(csvText, {
  header: true,  // NEW: Parse first row as headers
  complete: (results) => {
    const issues: IssueRow[] = results.data
      .map((row, index) => {
        const repository = row.repo?.trim()
        const level = row.level?.trim()  // NEW
        const issueId = parseInt(row.issueId?.trim() || '0', 10)

        // Validate level
        if (level && !['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
          console.warn(`Unexpected level value "${level}" at row ${index + 1}`)
        }

        return {
          rowNumber: index + 2,  // +2 because header is row 1
          repository,
          level,
          issueId,
        }
      })
      .filter(...)
  },
  // ...
})
```

### 3. Filtering Logic (lib/filters.ts)

**Add to FilterOptions:**
```typescript
export interface FilterOptions {
  search: string
  repository: string
  state: string
  author: string
  level: string  // NEW: 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
}
```

**Add new helper function:**
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

**Update filterIssues():**
```typescript
// Add level filter
if (filters.level !== 'all') {
  if (issue.level !== filters.level) {
    return false
  }
}
```

### 4. Table UI (components/IssueTable.tsx)

**Add to filter state:**
```typescript
const [filters, setFilters] = useState<FilterOptions>({
  search: '',
  repository: initialRepository || 'all',
  state: 'all',
  author: 'all',
  level: 'all',  // NEW
})
```

**Add level dropdown filter:**
Insert after Repository filter, before State filter. Use same styling as other selects.

```typescript
const uniqueLevels = useMemo(() => getUniqueLevels(issues), [issues])

// In JSX:
<div>
  <label htmlFor="level">Level</label>
  <select
    id="level"
    value={filters.level}
    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
  >
    <option value="all">All</option>
    {uniqueLevels.map((level) => (
      <option key={level} value={level}>{level}</option>
    ))}
  </select>
</div>
```

**Add level column to table:**
Insert after Repository column, before Issue # column.

```typescript
// In <thead>:
<th style={thStyle}>Level</th>

// In <tbody>:
<td style={tdStyle}>
  <span style={{
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    background: getLevelBadgeColor(issue.level).bg,
    color: getLevelBadgeColor(issue.level).text,
  }}>
    {issue.level}
  </span>
</td>
```

**Badge color helper:**
```typescript
function getLevelBadgeColor(level: string): { bg: string; text: string } {
  switch (level) {
    case 'Beginner':
      return { bg: '#d4edda', text: '#155724' }
    case 'Intermediate':
      return { bg: '#dbeafe', text: '#1e40af' }
    case 'Advanced':
      return { bg: '#fed7aa', text: '#c2410c' }
    default:
      return { bg: '#e5e7eb', text: '#374151' }
  }
}
```

## Visual Design

### Level Badge Colors

- **Beginner:** Green (#d4edda background, #155724 text)
- **Intermediate:** Blue (#dbeafe background, #1e40af text)
- **Advanced:** Orange (#fed7aa background, #c2410c text)

### Filter Layout

Filters appear in this order:
1. Search
2. Repository
3. **Level** (NEW)
4. State
5. Author

### Table Column Order

1. Row #
2. Repository
3. **Level** (NEW)
4. Issue #
5. Title
6. State
7. Author
8. Labels

## Error Handling

- **Invalid level values:** Log warning but don't fail; display value as-is with default gray badge
- **Missing level field:** Display empty or "-" in table
- **CSV parse errors:** Existing error handling remains unchanged

## Testing Considerations

1. Test with valid level values (Beginner, Intermediate, Advanced)
2. Test filtering by each level value
3. Test with missing level field in some rows
4. Test with invalid level values
5. Test that duplicate removal still works correctly
6. Verify color contrast for badge text is readable

## Implementation Notes

- Keep existing CSV error handling and duplicate removal logic
- Maintain consistency with existing filter/badge styles
- Use memoization for `getUniqueLevels()` similar to other filter helpers
- No breaking changes to existing functionality

## Future Enhancements (Out of Scope)

- Column sorting by level
- Default sort by level then issue number
- Grouping issues by level in display
- Multi-select level filtering
