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

  const { issues, loading, error, progress } = useIssues(accessAllowed)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            🔍 Curated Issues
          </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-secondary, #666)',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          Browse {issues.length > 0 ? issues.length : '...'} hand-picked GitHub issues from Backstage and Community Plugins
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
