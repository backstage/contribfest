import { HostCard } from '@/components/HostCard';
import { SessionsSidebar } from '@/components/SessionsSidebar';
import { hosts } from '@/lib/hosts';
import type { ContribFestSession } from '@/lib/types';

const sessions: ContribFestSession[] = [
  {
    location: 'Amsterdam',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'March 2026',
    blogUrl:
      'https://kccnceu2026.sched.com/event/2EF7v/contribfest-supercharge-your-open-source-impact-backstage-contribfest-live-andre-wanlin-emma-indal-spotify-heikki-hellgren-op-financial-group-elaine-bezerra-db-systel-gmbh?iframe=no',
    comingSoon: true,
    linkText: 'Add to Schedule',
  },
  {
    location: 'Atlanta',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2025',
    blogUrl:
      'https://backstage.io/blog/2025/11/25/backstagecon-kubecon-25-atlanta/#our-third-backstage-contribfest',
    sched:
      'https://kccncna2025.sched.com/event/27Nl6/contribfest-level-up-your-open-source-journey-hands-on-backstage-contributions-andre-wanlin-patrik-oldsberg-avantika-iyer-spotify-aramis-sennyey-doordash-kurt-king-procore',
  },
  {
    location: 'London',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'April 2025',
    blogUrl:
      'https://backstage.io/blog/2025/04/29/backstagecon-kubecon-25-london/#backstage-contribfest-goes-across-the-pond',
    sched:
      'https://kccnceu2025.sched.com/event/1tcyr/contribfest-contribute-with-confidence-dive-into-backstage',
  },
  {
    location: 'Salt Lake City',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2024',
    blogUrl:
      'https://backstage.io/blog/2024/12/09/kubecon-slc-24/#contribfest-its-all-about-community',
    sched:
      'https://kccncna2024.sched.com/event/1howP/contribfest-backstage-onboarding-your-journey-to-community-contribution',
  },
];

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
