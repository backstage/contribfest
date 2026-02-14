'use client'

import { useState, useMemo } from 'react'
import type { EnrichedIssue } from '@/lib/types'
import { filterIssues, getUniqueAuthors, getUniqueRepositories, getUniqueLevels } from '@/lib/filters'
import type { FilterOptions } from '@/lib/filters'

interface IssueTableProps {
  issues: EnrichedIssue[]
  initialRepository?: string
}

export function IssueTable({ issues, initialRepository }: IssueTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    repository: initialRepository || 'all',
    state: 'all',
    author: 'all',
    level: 'all',
  })

  // Get unique values for filters
  const uniqueAuthors = useMemo(() => getUniqueAuthors(issues), [issues])
  const uniqueRepositories = useMemo(() => getUniqueRepositories(issues), [issues])
  const uniqueLevels = useMemo(() => getUniqueLevels(issues), [issues])

  // Apply filters
  const filteredIssues = useMemo(
    () => filterIssues(issues, filters),
    [issues, filters]
  )

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
      {/* Filters */}
      <div
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
          <input
            id="search"
            type="text"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
          />
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
            htmlFor="state"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            State
          </label>
          <select
            id="state"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="author"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Author
          </label>
          <select
            id="author"
            value={filters.author}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="all">All</option>
            {uniqueAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
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
        Showing {filteredIssues.length} of {issues.length} issues
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'var(--bui-bg-app, #f8f8f8)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
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
          <tbody>
            {filteredIssues.map((issue) => (
              <tr
                key={`${issue.repository}-${issue.issueId}`}
                style={{
                  borderBottom: '1px solid var(--bui-border-1, #d5d5d5)',
                }}
              >
                <td style={tdStyle}>{issue.rowNumber}</td>
                <td style={tdStyle}>
                  <code style={{ fontSize: '12px' }}>{issue.repository}</code>
                </td>
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
                <td style={tdStyle}>
                  {issue.githubData?.title || (
                    <span style={{ color: 'var(--bui-fg-secondary, #666)' }}>
                      {issue.error || 'Loading...'}
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  {issue.githubData?.state && (
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background:
                          issue.githubData.state === 'open'
                            ? '#d4edda'
                            : '#f8d7da',
                        color:
                          issue.githubData.state === 'open' ? '#155724' : '#721c24',
                      }}
                    >
                      {issue.githubData.state}
                    </span>
                  )}
                </td>
                <td style={tdStyle}>{issue.githubData?.user.login || '-'}</td>
                <td style={tdStyle}>
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

      {filteredIssues.length === 0 && (
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
