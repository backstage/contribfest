'use client'

import type { ContribFestSession } from '@/lib/types'
import { RiExternalLinkLine } from '@remixicon/react'

interface SessionCardProps {
  session: ContribFestSession
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <div
      style={{
        background: 'var(--bui-bg-popover, #fff)',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '8px',
        padding: '16px',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-bg-solid, #1f5493)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-border-1, #d5d5d5)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            margin: 0,
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          {session.location}
        </h3>
        {session.comingSoon && (
          <div
            style={{
              display: 'inline-block',
              background: 'var(--bui-bg-solid, #1f5493)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            Coming Soon
          </div>
        )}
      </div>
      {session.subtitle && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--bui-fg-secondary, #666)',
            marginBottom: '4px',
            fontStyle: 'italic',
          }}
        >
          {session.subtitle}
        </p>
      )}
      <p
        style={{
          fontSize: '14px',
          color: 'var(--bui-fg-secondary, #666)',
          marginBottom: '12px',
        }}
      >
        {session.date}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a
          href={session.blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: 'var(--bui-bg-solid, #1f5493)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {session.linkText || 'View Blog Post'}
          <RiExternalLinkLine size={16} />
        </a>
        {session.sched && (
          <a
            href={session.sched}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: 'var(--bui-bg-solid, #1f5493)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            View on Sched
            <RiExternalLinkLine size={16} />
          </a>
        )}
      </div>
    </div>
  )
}
