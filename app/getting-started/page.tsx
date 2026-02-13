'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ChecklistItem } from '@/components/ChecklistItem'
import type { ChecklistItem as ChecklistItemType } from '@/lib/types'

const initialChecklist: ChecklistItemType[] = [
  {
    id: 'nodejs',
    label: 'Install Node.js',
    link: 'https://nodejs.org/',
    completed: false,
  },
  {
    id: 'yarn',
    label: 'Install Yarn',
    link: 'https://yarnpkg.com/getting-started/install',
    completed: false,
  },
  {
    id: 'fork-backstage',
    label: 'Fork Backstage Repository',
    link: 'https://github.com/backstage/backstage/fork',
    completed: false,
  },
  {
    id: 'fork-plugins',
    label: 'Fork Community Plugins Repository',
    link: 'https://github.com/backstage/community-plugins/fork',
    completed: false,
  },
]

export default function GettingStartedPage() {
  const [checklist, setChecklist] = useLocalStorage<ChecklistItemType[]>(
    'contribfest-checklist',
    initialChecklist
  )

  const handleToggle = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const completedCount = checklist.filter((item) => item.completed).length
  const totalCount = checklist.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            color: 'var(--text-primary, #000)',
          }}
        >
          Getting Started
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary, #666)',
            lineHeight: '1.6',
            marginBottom: '16px',
          }}
        >
          Complete these steps to set up your development environment for contributing to
          Backstage.
        </p>
        <div
          style={{
            padding: '16px',
            background: 'var(--bg-active, #e3f2fd)',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary, #000)',
          }}
        >
          Progress: {completedCount} / {totalCount} ({percentage}%)
        </div>
      </div>

      <div style={{ maxWidth: '600px' }}>
        {checklist.map((item) => (
          <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  )
}
