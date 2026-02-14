'use client'

import { usePullRequests } from '@/hooks/usePullRequests'
import { PullRequestTable } from '@/components/PullRequestTable'
import { SessionsSidebar } from '@/components/SessionsSidebar'
import type { ContribFestSession } from '@/lib/types'

const sessions: ContribFestSession[] = [
  {
    location: 'Amsterdam',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'March 2026',
    blogUrl: '#',
    comingSoon: true,
    linkText: 'Add to Schedule',
  },
  {
    location: 'Atlanta',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2025',
    blogUrl: 'https://backstage.io/blog/2025/11/25/backstagecon-kubecon-25-atlanta/#our-third-backstage-contribfest',
  },
  {
    location: 'London',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'April 2025',
    blogUrl: 'https://backstage.io/blog/2025/04/29/backstagecon-kubecon-25-london/#backstage-contribfest-goes-across-the-pond',
  },
  {
    location: 'Salt Lake City',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2024',
    blogUrl: 'https://backstage.io/blog/2024/12/09/kubecon-slc-24/#contribfest-its-all-about-community',
  },
]

export default function ContribChampsPage() {
  const { pullRequests, loading, error, refresh } = usePullRequests()

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                margin: 0,
                color: 'var(--bui-fg-primary, #000)',
              }}
            >
              Contrib Champs
            </h1>
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
          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Celebrating contributors! Browse merged pull requests with the contribfest label
            from Backstage and Community Plugins repositories.
          </p>
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
