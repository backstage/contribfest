'use client'

import { useIssues } from '@/hooks/useIssues'
import { IssueTable } from '@/components/IssueTable'
import { CountdownModal } from '@/components/CountdownModal'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function IssuesPage() {
  const searchParams = useSearchParams()
  const initialRepository = searchParams.get('repository') || undefined
  const isAdmin = searchParams.get('admin') === 'true'

  // Check if access is allowed (after March 26, 2026 or admin bypass)
  const { accessAllowed, targetDate } = useMemo(() => {
    const target = new Date('2026-03-26T00:00:00')
    const now = new Date()
    const allowed = now >= target || isAdmin

    return {
      accessAllowed: allowed,
      targetDate: target,
    }
  }, [isAdmin])

  const { issues, loading, error, progress, refresh, lastUpdated } = useIssues(accessAllowed)

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins === 1) return '1 minute ago'
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return '1 hour ago'
    return `${diffHours} hours ago`
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              margin: 0,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            🔍 Curated Issues
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastUpdated && (
              <span style={{ fontSize: '14px', color: 'var(--bui-fg-secondary, #666)' }}>
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            )}
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
        </div>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-secondary, #666)',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          Browse 86 hand-picked GitHub issues from Backstage and Community Plugins
          repositories. Use filters to find issues that match your interests and skill level.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--bui-bg-app, #f8f8f8)',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '12px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Loading Issues...
          </div>
          {progress && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--bui-fg-secondary, #666)',
                  marginBottom: '12px',
                }}
              >
                Fetching metadata: {progress.current} / {progress.total}
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bui-bg-popover, #fff)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                    height: '100%',
                    background: 'var(--bui-bg-solid, #1f5493)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}
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
            Error Loading Issues
          </div>
          <div style={{ fontSize: '14px' }}>{error}</div>
        </div>
      )}

      {/* Issues Table */}
      {!loading && !error && issues.length > 0 && (
        <IssueTable issues={issues} initialRepository={initialRepository} />
      )}

      {/* No Issues State */}
      {!loading && !error && issues.length === 0 && (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--bui-bg-app, #f8f8f8)',
            borderRadius: '8px',
            color: 'var(--bui-fg-secondary, #666)',
          }}
        >
          No issues found.
        </div>
      )}

      {/* Countdown Modal - shown if access is not allowed */}
      {!accessAllowed && <CountdownModal targetDate={targetDate} />}
    </div>
  )
}
