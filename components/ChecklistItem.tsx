'use client'

import type { ChecklistItem as ChecklistItemType } from '@/lib/types'

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
        border: '1px solid var(--border-color, #e0e0e0)',
        borderRadius: '8px',
        background: 'var(--bg-secondary, #f5f5f5)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-active, #e3f2fd)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-secondary, #f5f5f5)'
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
            color: 'var(--text-primary, #000)',
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
              color: 'var(--link-active, #1976d2)',
              fontWeight: 500,
            }}
          >
            →
          </a>
        )}
      </div>
    </div>
  )
}
