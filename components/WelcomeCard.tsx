'use client'

import Link from 'next/link'
import type { ResourceCard } from '@/lib/types'
import { RiArrowRightLine, RiExternalLinkLine } from '@remixicon/react'

export function WelcomeCard({ title, description, url, isExternal }: ResourceCard) {
  const cardStyle = {
    border: '1px solid var(--bui-border-1, #d5d5d5)',
    borderRadius: '8px',
    padding: '24px',
    background: 'var(--bui-bg-app, #f8f8f8)',
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
          color: 'var(--bui-fg-primary, #000)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--bui-fg-secondary, #666)',
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
          color: 'var(--bui-bg-solid, #1f5493)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {isExternal ? (
          <>
            View Resource
            <RiExternalLinkLine size={16} />
          </>
        ) : (
          <>
            View
            <RiArrowRightLine size={16} />
          </>
        )}
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
