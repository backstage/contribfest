'use client'

import { usePullRequests } from '@/hooks/usePullRequests'
import { PullRequestTable } from '@/components/PullRequestTable'
import { SessionsSidebar } from '@/components/SessionsSidebar'
import { sessions } from '@/lib/sessions'
import { formatUpdatedAgo } from '@/lib/snapshot'

export default function ContribChampsPage() {
  const { pullRequests, generatedAt, loading, error } = usePullRequests()

  return (
    <div className="contrib-champs-layout">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            🏆 Contrib Champs
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Take a look at the fantastic ContribFest contributions that have been merged into the
            Backstage and Community Plugins repositories — huge thanks to everyone who made them
            happen!
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
