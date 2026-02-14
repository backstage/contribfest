'use client'

import { useState, useMemo } from 'react'
import type { GitHubPullRequest } from '@/lib/types'

interface PullRequestTableProps {
  pullRequests: GitHubPullRequest[]
}

type SortColumn = 'number' | 'user' | 'title' | 'repository' | 'created_at'
type SortDirection = 'asc' | 'desc'

export function PullRequestTable({ pullRequests }: PullRequestTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

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
  const sortedPullRequests = useMemo(() => {
    const sorted = [...pullRequests]
    sorted.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortColumn) {
        case 'number':
          aValue = a.number
          bValue = b.number
          break
        case 'user':
          aValue = a.user.login
          bValue = b.user.login
          break
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'repository':
          aValue = a.repository
          bValue = b.repository
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      // String comparison
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [pullRequests, sortColumn, sortDirection])

  if (pullRequests.length === 0) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          color: 'var(--bui-fg-secondary, #666)',
          background: 'var(--bui-bg-app, #f8f8f8)',
          borderRadius: '8px',
        }}
      >
        No pull requests found.
      </div>
    )
  }

  return (
    <div>
      {/* PR Count */}
      <div
        style={{
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--bui-fg-secondary, #666)',
        }}
      >
        Showing {sortedPullRequests.length} pull request{sortedPullRequests.length !== 1 ? 's' : ''}
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
              <th
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('number')}
              >
                PR # {sortColumn === 'number' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('user')}
              >
                Author {sortColumn === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('title')}
              >
                Title {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('repository')}
              >
                Repository {sortColumn === 'repository' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('created_at')}
              >
                Created {sortColumn === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPullRequests.map((pr, index) => (
              <tr
                key={`${pr.repository}-${pr.number}`}
                style={{
                  borderBottom: '1px solid var(--bui-border-1, #d5d5d5)',
                  background: index % 2 === 0 ? 'var(--bui-bg-app, #f8f8f8)' : 'var(--bui-bg-surface, #f0f0f0)',
                }}
              >
                <td style={tdStyle}>
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--bui-bg-solid, #1f5493)',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    #{pr.number}
                  </a>
                </td>
                <td style={tdStyle}>
                  <a
                    href={pr.user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--bui-bg-solid, #1f5493)',
                      textDecoration: 'none',
                    }}
                  >
                    {pr.user.login}
                  </a>
                </td>
                <td style={tdStyle}>{pr.title}</td>
                <td style={tdStyle}>
                  <code style={{ fontSize: '12px' }}>{pr.repository}</code>
                </td>
                <td style={tdStyle}>{formatDate(pr.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

// Helper to format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}
