'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { EnrichedIssue, IssueAvailability } from '@/lib/types'
import {
  availabilityOptions,
  filterIssues,
  getAvailabilitySortOrder,
  getUniqueRepositories,
  getUniqueLevels,
  getUniqueLabels,
} from '@/lib/filters'
import type { FilterOptions } from '@/lib/filters'
import { RiSearchLine, RiExternalLinkLine } from '@remixicon/react'
import { pinnedIssues } from '@/lib/pinned-issues'

interface IssueTableProps {
  issues: EnrichedIssue[]
  initialRepository?: string
}

type SortColumn = 'rowNumber' | 'repository' | 'level' | 'issueId' | 'title' | 'availability'
type SortDirection = 'asc' | 'desc'

export function IssueTable({ issues, initialRepository }: IssueTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    repository: initialRepository || 'all',
    availability: 'available',
    level: 'all',
    label: 'all',
  })
  const [sortColumn, setSortColumn] = useState<SortColumn>('level')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Get unique values for filters
  const uniqueRepositories = useMemo(() => getUniqueRepositories(issues), [issues])
  const uniqueLevels = useMemo(() => getUniqueLevels(issues), [issues])
  const uniqueLabels = useMemo(() => getUniqueLabels(issues), [issues])

  // Apply filters
  const filteredIssues = useMemo(
    () => filterIssues(issues, filters),
    [issues, filters]
  )

  // How many issues are still up for grabs given the other filters
  const availableCount = useMemo(
    () =>
      filterIssues(issues, { ...filters, availability: 'all' }).filter(
        (issue) => issue.availability === 'available'
      ).length,
    [issues, filters]
  )

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Apply sorting
  const sortedIssues = useMemo(() => {
    const sorted = [...filteredIssues]
    sorted.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortColumn) {
        case 'rowNumber':
          aValue = a.rowNumber
          bValue = b.rowNumber
          break
        case 'repository':
          aValue = a.repository
          bValue = b.repository
          break
        case 'level':
          // Use custom order for levels: Beginner (1), Intermediate (2), Advanced (3)
          aValue = getLevelSortOrder(a.level)
          bValue = getLevelSortOrder(b.level)
          break
        case 'issueId':
          aValue = a.issueId
          bValue = b.issueId
          break
        case 'title':
          aValue = a.githubData?.title || ''
          bValue = b.githubData?.title || ''
          break
        case 'availability':
          aValue = getAvailabilitySortOrder(a.availability)
          bValue = getAvailabilitySortOrder(b.availability)
          break
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (aValue !== bValue) {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }
      } else {
        // String comparison
        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()
        if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1
        if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1
      }

      // Tie-break so available issues are listed first
      return getAvailabilitySortOrder(a.availability) - getAvailabilitySortOrder(b.availability)
    })
    return sorted
  }, [filteredIssues, sortColumn, sortDirection])

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid var(--bui-border-1, #d5d5d5)',
    borderRadius: '4px',
    fontSize: '14px',
    background: 'var(--bui-bg-app, #f8f8f8)',
    color: 'var(--bui-fg-primary, #000)',
  }

  return (
    <div>
      {/* Pinned Issue Cards */}
      <div
        className="pinned-issues-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {pinnedIssues.map((issue) => {
          const githubUrl = `https://github.com/${issue.repository}/issues/${issue.issueId}`
          const badgeColor = getLevelBadgeColor(issue.level)
          return (
            <a
              key={`${issue.repository}-${issue.issueId}`}
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open GitHub issue #${issue.issueId} in ${issue.repository}`}
              style={{
                display: 'block',
                position: 'relative',
                background: 'var(--bui-bg-popover, #fff)',
                border: '1px solid var(--bui-border-1, #d5d5d5)',
                borderRadius: '8px',
                padding: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, {
                  borderColor: 'var(--bui-bg-solid, #1f5493)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                })
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--bui-border-1, #d5d5d5)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '16px',
                  display: 'block',
                }}
              >
                📌
              </span>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--bui-fg-primary, #000)',
                  marginBottom: '12px',
                  lineHeight: '1.4',
                  paddingRight: '28px',
                }}
              >
                {issue.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    ...badgeColor,
                  }}
                >
                  {issue.level}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--bui-bg-solid, #1f5493)',
                  }}
                >
                  #{issue.issueId}
                </span>
                <code style={{ fontSize: '12px', color: 'var(--bui-fg-secondary, #666)' }}>
                  {issue.repository}
                </code>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500, color: 'var(--bui-bg-solid, #1f5493)' }}>
                View Issue
                <RiExternalLinkLine size={14} />
              </div>
            </a>
          )
        })}
      </div>

      {/* Filters */}
      <div
        className="issue-filters"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
          padding: '20px',
          background: 'var(--bui-bg-app, #f8f8f8)',
          borderRadius: '8px',
        }}
      >
        <div>
          <label
            htmlFor="search"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Search
          </label>
          <div style={{ position: 'relative' }}>
          <input
            id="search"
            type="text"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ ...inputStyle, width: '100%', paddingLeft: '36px' }}
          />
          <RiSearchLine
            size={16}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--bui-fg-secondary, #666)',
              pointerEvents: 'none',
            }}
          />
          </div>
        </div>

        <div>
          <label
            htmlFor="repository"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Repository
          </label>
          <select
            id="repository"
            value={filters.repository}
            onChange={(e) => setFilters({ ...filters, repository: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="all">All</option>
            {uniqueRepositories.map((repo) => (
              <option key={repo} value={repo}>
                {repo}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label
            htmlFor="availability"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Availability
          </label>
          <select
            id="availability"
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="all">All</option>
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="label"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Label
          </label>
          <select
            id="label"
            value={filters.label}
            onChange={(e) => setFilters({ ...filters, label: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="all">All</option>
            {uniqueLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issue Count */}
      <div
        style={{
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--bui-fg-secondary, #666)',
        }}
      >
        Showing {sortedIssues.length} of {issues.length} issues · {availableCount} available
      </div>

      {/* Fallback when the small issues have all been picked up */}
      {availableCount <= 3 && (
        <div
          role="note"
          style={{
            marginBottom: '16px',
            padding: '16px',
            borderRadius: '8px',
            background: 'var(--contribfest-progress-bg, #dcfce7)',
            color: 'var(--bui-fg-primary, #000)',
            fontSize: '15px',
            lineHeight: '1.6',
          }}
        >
          {availableCount === 0 ? 'All of these issues have been picked up' : 'Only a few of these issues are still available'}
          {' '}— nice work, everyone! Small issues aren&apos;t the only way to contribute:{' '}
          <Link href="/ideas/" style={{ color: 'var(--bui-bg-solid, #1f5493)', fontWeight: 600 }}>
            bring your own idea →
          </Link>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          className="issue-table"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'var(--bui-bg-popover, #fff)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ background: 'rgba(31, 84, 147, 0.08)' }}>
              <th
                className="col-hide-mobile"
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('rowNumber')}
              >
                Row # <span className="sort-indicator">{sortColumn === 'rowNumber' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
              </th>
              <th
                className="col-hide-mobile"
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('repository')}
              >
                Repository <span className="sort-indicator">{sortColumn === 'repository' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
              </th>
              <th
                className="col-compact"
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('level')}
              >
                Level <span className="sort-indicator">{sortColumn === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
              </th>
              <th
                className="col-compact"
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('issueId')}
              >
                Issue # <span className="sort-indicator">{sortColumn === 'issueId' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
              </th>
              <th
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('title')}
              >
                Title <span className="sort-indicator">{sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
              </th>
              <th
                className="col-hide-mobile"
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('availability')}
              >
                Availability <span className="sort-indicator">{sortColumn === 'availability' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
              </th>
              <th className="col-hide-mobile" style={thStyle}>Labels</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.map((issue, index) => (
              <tr
                key={`${issue.repository}-${issue.issueId}`}
                style={{
                  borderBottom: '1px solid var(--bui-border-1, #d5d5d5)',
                  background: index % 2 === 0 ? 'transparent' : 'rgba(128, 128, 128, 0.1)',
                }}
              >
                <td className="col-hide-mobile" style={tdStyle}>{issue.rowNumber}</td>
                <td className="col-hide-mobile" style={tdStyle}>
                  <code style={{ fontSize: '12px' }}>{issue.repository}</code>
                </td>
                <td className="col-compact" style={tdStyle}>
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
                <td className="col-compact" style={tdStyle}>
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
                <td style={tdStyle}>
                  {issue.githubData?.title || (
                    <span style={{ color: 'var(--bui-fg-secondary, #666)' }}>
                      {issue.error || 'Loading...'}
                    </span>
                  )}
                </td>
                <td className="col-hide-mobile" style={tdStyle}>
                  <AvailabilityBadge issue={issue} />
                </td>
                <td className="col-hide-mobile" style={tdStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {issue.githubData?.labels.slice(0, 3).map((label) => (
                      <span
                        key={label.name}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          background: `#${label.color}`,
                          color: getContrastColor(label.color),
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                    {issue.githubData?.labels && issue.githubData.labels.length > 3 && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--bui-fg-secondary, #666)',
                        }}
                      >
                        +{issue.githubData.labels.length - 3}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedIssues.length === 0 && (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            color: 'var(--bui-fg-secondary, #666)',
          }}
        >
          No issues found matching your filters.
        </div>
      )}
    </div>
  )
}

function AvailabilityBadge({ issue }: { issue: EnrichedIssue }) {
  if (!issue.availability) return null

  const style = {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    ...getAvailabilityBadgeColor(issue.availability),
  }
  const label = availabilityOptions.find((option) => option.value === issue.availability)?.label

  // Link straight to the PR so people can see who is already on it
  const pr = issue.linkedPRs?.[0]
  if (issue.availability === 'has-pr' && pr) {
    return (
      <a
        href={pr.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${pr.state === 'merged' ? 'Merged' : 'Open'} PR #${pr.number} by @${pr.author}`}
        style={{ ...style, textDecoration: 'none' }}
      >
        {label} #{pr.number}
      </a>
    )
  }

  const title =
    issue.availability === 'assigned' && issue.assignees?.length
      ? `Assigned to ${issue.assignees.map((login) => `@${login}`).join(', ')}`
      : undefined

  return (
    <span style={style} title={title}>
      {label}
    </span>
  )
}

function getAvailabilityBadgeColor(availability: IssueAvailability): { background: string; color: string } {
  switch (availability) {
    case 'available':
      return { background: '#d4edda', color: '#155724' }
    case 'assigned':
      return { background: '#fef3c7', color: '#92400e' }
    case 'has-pr':
      return { background: '#dbeafe', color: '#1e40af' }
    case 'closed':
      return { background: '#e5e7eb', color: '#374151' }
  }
}

const thStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--bui-fg-primary, #000)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '14px',
  color: 'var(--bui-fg-primary, #000)',
}

// Helper to get contrasting text color for label backgrounds
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.substring(0, 2), 16)
  const g = parseInt(hexColor.substring(2, 4), 16)
  const b = parseInt(hexColor.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

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

// Helper to get sort order for levels (Beginner first, then Intermediate, then Advanced)
function getLevelSortOrder(level: string): number {
  switch (level) {
    case 'Beginner':
      return 1
    case 'Intermediate':
      return 2
    case 'Advanced':
      return 3
    default:
      return 4
  }
}
