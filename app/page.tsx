import { WelcomeCard } from '@/components/WelcomeCard'
import type { ResourceCard } from '@/lib/types'

const resources: ResourceCard[] = [
  {
    title: 'Backstage Repository',
    description:
      'The main Backstage repository containing the core platform and plugins. Start here to explore the codebase and understand the architecture.',
    url: 'https://github.com/backstage/backstage',
    isExternal: true,
  },
  {
    title: 'Community Plugins',
    description:
      'A collection of community-contributed plugins that extend Backstage functionality. Great place to find issues and contribute new features.',
    url: 'https://github.com/backstage/community-plugins',
    isExternal: true,
  },
  {
    title: 'Backstage Contribution Guide',
    description:
      'Learn how to contribute to the Backstage core project. Covers setup, development workflow, and contribution guidelines.',
    url: 'https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md',
    isExternal: true,
  },
  {
    title: 'Community Plugins Contribution Guide',
    description:
      'Specific guidelines for contributing to community plugins. Includes plugin development best practices and submission process.',
    url: 'https://github.com/backstage/community-plugins/blob/main/CONTRIBUTING.md',
    isExternal: true,
  },
  {
    title: 'ContribFest Slide Deck',
    description:
      'Presentation slides with workshop overview, contribution tips, and resources. Reference this for workshop structure and guidance.',
    url: '#',
    isExternal: true,
  },
  {
    title: 'Curated Issues',
    description:
      'Browse 86 hand-picked GitHub issues suitable for contribution. Filter by repository, state, and author to find your perfect first issue.',
    url: '/issues/',
    isExternal: false,
  },
]

export default function Page() {
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
          Welcome to ContribFest
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary, #666)',
            lineHeight: '1.6',
          }}
        >
          Your guide to contributing to Backstage and Community Plugins. Explore resources,
          complete your setup checklist, and find issues to work on.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {resources.map((resource) => (
          <WelcomeCard key={resource.title} {...resource} />
        ))}
      </div>
    </div>
  )
}
