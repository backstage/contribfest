'use client'

import { RiLinkedinBoxFill } from '@remixicon/react'
import type { Host } from '@/lib/types'

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  return (
    <div
      style={{
        background: 'var(--bui-bg-popover, #fff)',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '8px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-bg-solid, #268271)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-border-1, #d5d5d5)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Profile image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={host.imagePath}
        alt={host.name}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '16px',
          border: '2px solid var(--bui-border-1, #d5d5d5)',
        }}
      />

      {/* Name */}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 4px 0',
          color: 'var(--bui-fg-primary, #000)',
        }}
      >
        {host.name}
      </h3>

      {/* Title */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--bui-fg-secondary, #666)',
          margin: '0 0 2px 0',
        }}
      >
        {host.title}
      </p>

      {/* Company */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--bui-fg-secondary, #666)',
          margin: '0 0 16px 0',
        }}
      >
        {host.company}
      </p>

      {/* KubeCon badge */}
      <div
        style={{
          display: 'inline-block',
          background: 'var(--bui-bg-solid, #268271)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '4px 10px',
          borderRadius: '4px',
          marginTop: 'auto',
        }}
      >
        {host.kubecon}
      </div>

      {/* LinkedIn link */}
      {host.linkedinUrl && (
        <a
          href={host.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${host.name} on LinkedIn`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '12px',
            fontSize: '13px',
            color: 'var(--bui-bg-solid, #268271)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          <RiLinkedinBoxFill size={16} />
          LinkedIn
        </a>
      )}
    </div>
  )
}
