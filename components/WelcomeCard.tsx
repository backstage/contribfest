'use client'

import Link from 'next/link'
import type { ResourceCard } from '@/lib/types'

export function WelcomeCard({ title, description, url, isExternal }: ResourceCard) {
  const cardStyle = {
    border: '1px solid var(--border-color, #e0e0e0)',
    borderRadius: '8px',
    padding: '24px',
    background: 'var(--bg-secondary, #f5f5f5)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  }

  const hoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }

  const content = (
    <>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '12px',
          color: 'var(--text-primary, #000)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary, #666)',
          lineHeight: '1.6',
          flex: 1,
        }}
      >
        {description}
      </p>
      <div
        style={{
          marginTop: '16px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--link-active, #1976d2)',
        }}
      >
        {isExternal ? 'View Resource →' : 'View →'}
      </div>
    </>
  )

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={cardStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, hoverStyle)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={url}
      style={cardStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyle)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {content}
    </Link>
  )
}
