import { HostCard } from '@/components/HostCard';
import { SessionsSidebar } from '@/components/SessionsSidebar';
import { hosts } from '@/lib/hosts';
import { sessions } from '@/lib/sessions';

export default function HallOfHostsPage() {
  return (
    <div className="contrib-champs-layout">
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Page header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            🙏 Hall of Hosts
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Meet the people who made ContribFest happen. These hosts organized
            and facilitated Backstage ContribFest sessions at KubeCon events
            around Europe and North America.
          </p>
        </div>

        {/* Host cards grid */}
        {hosts.length === 0 ? (
          <div
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              background: 'var(--bui-bg-app, #f5f6f7)',
              borderRadius: '8px',
              color: 'var(--bui-fg-secondary, #666)',
              fontSize: '16px',
            }}
          >
            Host profiles coming soon!
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {hosts.map((host, i) => (
              <HostCard key={`${host.name}-${i}`} host={host} />
            ))}
          </div>
        )}
      </div>

      {/* Sessions sidebar */}
      <SessionsSidebar sessions={sessions} />
    </div>
  );
}
