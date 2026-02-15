import { SessionCard } from './SessionCard'
import type { ContribFestSession } from '@/lib/types'

interface SessionsSidebarProps {
  sessions: ContribFestSession[]
}

export function SessionsSidebar({ sessions }: SessionsSidebarProps) {
  return (
    <aside
      style={{
        width: '300px',
        marginLeft: '32px',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '32px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Past ContribFest Sessions
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {sessions.map((session) => (
            <SessionCard key={session.location} session={session} />
          ))}
        </div>
      </div>
    </aside>
  )
}
