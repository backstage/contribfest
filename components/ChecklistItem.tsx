'use client'

import type { ChecklistItem as ChecklistItemType } from '@/lib/types'
import { RiExternalLinkLine } from '@remixicon/react'

interface ChecklistItemProps {
  item: ChecklistItemType
  onToggle: (id: string) => void
}

export function ChecklistItem({ item, onToggle }: ChecklistItemProps) {
  const handleClick = () => {
    onToggle(item.id)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '8px',
        background: 'var(--bui-bg-app, #f8f8f8)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bui-bg-info, #dbeafe)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bui-bg-app, #f8f8f8)'
      }}
    >
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => {}} // Controlled by parent click
        style={{
          width: '20px',
          height: '20px',
          marginRight: '16px',
          cursor: 'pointer',
        }}
        aria-label={`Mark "${item.label}" as complete`}
      />
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-primary, #000)',
            textDecoration: item.completed ? 'line-through' : 'none',
            fontWeight: item.completed ? 400 : 500,
          }}
        >
          {item.label}
        </span>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              marginLeft: '8px',
              fontSize: '14px',
              color: 'var(--bui-bg-solid, #1f5493)',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <RiExternalLinkLine size={16} />
          </a>
        )}
      </div>
    </div>
  )
}
