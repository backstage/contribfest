'use client'

import { useIssues } from '@/hooks/useIssues'
import { IssueTable } from '@/components/IssueTable'
import { CountdownModal } from '@/components/CountdownModal'
import { InactiveIssuesPage } from '@/components/InactiveIssuesPage'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import Link from 'next/link'
import { CONTRIBFEST_ACTIVE, EVENT_TIMEZONE, ISSUES_UNLOCK_AT } from '@/lib/event'
import { formatUpdatedAgo } from '@/lib/snapshot'

export default function IssuesPageContent() {
  const searchParams = useSearchParams()
  const initialRepository = searchParams.get('repository') || undefined
  const isAdmin = searchParams.get('admin') === 'true'

  const showCuratedList = CONTRIBFEST_ACTIVE || isAdmin

  // Check if access is allowed (after the unlock date or admin bypass)
  const accessAllowed = useMemo(() => new Date() >= ISSUES_UNLOCK_AT || isAdmin, [isAdmin])

  const { issues, generatedAt, loading, error } = useIssues(showCuratedList && accessAllowed)

  if (!showCuratedList) {
    return <InactiveIssuesPage />
  }

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
          Browse {issues.length > 0 && `${issues.length} `}hand-picked GitHub issues from Backstage and Community Plugins
          repositories. Use filters to find issues that match your interests and skill level.
          Have something else in mind?{' '}
          <Link href="/ideas/" style={{ color: 'var(--bui-bg-solid, #1f5493)', fontWeight: 600 }}>
            Bring your own idea
          </Link>
          .
        </p>
        {generatedAt && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--bui-fg-secondary, #666)',
              marginTop: '8px',
              marginBottom: 0,
            }}
            title={new Date(generatedAt).toLocaleString()}
          >
            GitHub data updated {formatUpdatedAgo(generatedAt)}
          </p>
        )}
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
            Loading issues...
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
          {accessAllowed
            ? 'No issues found.'
            : `The curated issues list unlocks on ${ISSUES_UNLOCK_AT.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', timeZone: EVENT_TIMEZONE })}.`}
        </div>
      )}

      {/* Countdown Modal - shown if access is not allowed */}
      {!accessAllowed && <CountdownModal targetDate={ISSUES_UNLOCK_AT} />}
    </div>
  )
}
