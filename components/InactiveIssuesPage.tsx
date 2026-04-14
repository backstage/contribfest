import { RiExternalLinkLine } from '@remixicon/react'

const REPOS = [
  {
    name: 'backstage/backstage',
    label: 'Backstage',
    allIssues: 'https://github.com/backstage/backstage/issues',
    goodFirstIssues:
      'https://github.com/backstage/backstage/issues?q=is%3Aopen+label%3A%22good+first+issue%22',
    goodFirstIssuesLabel: 'Good First Issues',
  },
  {
    name: 'backstage/community-plugins',
    label: 'Community Plugins',
    allIssues: 'https://github.com/backstage/community-plugins/issues',
    goodFirstIssues:
      'https://github.com/backstage/community-plugins/issues?q=is%3Aopen+label%3A%22good+first+issue%22%2C%22help+wanted%22',
    goodFirstIssuesLabel: 'Good First Issue / Help Wanted',
  },
]

export function InactiveIssuesPage() {
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
          ContribFest has wrapped up for this cycle. In the meantime, explore open issues in the
          Backstage repositories below and find something to contribute to.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {REPOS.map(repo => (
          <div
            key={repo.name}
            style={{
              border: '1px solid var(--bui-border-1, #d5d5d5)',
              borderRadius: '8px',
              padding: '24px',
              background: 'var(--bui-bg-popover, #fff)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '4px',
                  color: 'var(--bui-fg-primary, #000)',
                }}
              >
                {repo.label}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--bui-fg-secondary, #666)',
                  margin: 0,
                }}
              >
                {repo.name}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              <a
                href={repo.allIssues}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--bui-bg-solid, #268271)',
                  textDecoration: 'none',
                }}
              >
                All Issues
                <RiExternalLinkLine size={16} />
              </a>

              <a
                href={repo.goodFirstIssues}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--bui-bg-solid, #268271)',
                  textDecoration: 'none',
                }}
              >
                {repo.goodFirstIssuesLabel}
                <RiExternalLinkLine size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
