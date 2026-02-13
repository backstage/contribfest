'use client'

import { useIssues } from '@/hooks/useIssues'
import { IssueTable } from '@/components/IssueTable'

export default function IssuesPage() {
  const { issues, loading, error, progress } = useIssues()

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            color: 'var(--text-primary, #000)',
          }}
        >
          Curated Issues
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary, #666)',
            lineHeight: '1.6',
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
            background: 'var(--bg-secondary, #f5f5f5)',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '12px',
              color: 'var(--text-primary, #000)',
            }}
          >
            Loading Issues...
          </div>
          {progress && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary, #666)',
                  marginBottom: '12px',
                }}
              >
                Fetching metadata: {progress.current} / {progress.total}
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-primary, #fff)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                    height: '100%',
                    background: 'var(--link-active, #1976d2)',
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
      {!loading && !error && issues.length > 0 && <IssueTable issues={issues} />}

      {/* No Issues State */}
      {!loading && !error && issues.length === 0 && (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--bg-secondary, #f5f5f5)',
            borderRadius: '8px',
            color: 'var(--text-secondary, #666)',
          }}
        >
          No issues found.
        </div>
      )}
    </div>
  )
}
