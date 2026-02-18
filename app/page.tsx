import { WelcomeCard } from '@/components/WelcomeCard'
import type { ResourceCard } from '@/lib/types'

const sessionResources: ResourceCard[] = [
  {
    title: 'ContribFest Slide Deck',
    description:
      'Presentation slides with workshop overview, contribution tips, and resources. Reference this for workshop structure and guidance.',
    url: 'https://backstage.github.io/contribfest/KubeCon-Amsterdam-Backstage-ContribFest-2026.pdf',
    isExternal: true,
  },
  {
    title: 'Assignment Sheet',
    description:
      'Google Sheet for participants to assign themselves to issues they want to work on. Claim your issue and track progress during the session.',
    url: 'https://docs.google.com/spreadsheets/d/1lltOy3A25zWUXb3XdtkHBD5CHzrmfm8DRaWt7vh0WKU/edit?gid=232343915#gid=232343915',
    isExternal: true,
  },
]

const repositoryResources: ResourceCard[] = [
  {
    title: 'Backstage Repository',
    description:
      'The main Backstage repository containing the core platform and plugins. Start here to explore the codebase and understand the architecture.',
    url: 'https://github.com/backstage/backstage',
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
    title: 'Backstage Repository Issues',
    description:
      'View curated issues specifically from the main Backstage repository. Perfect for contributing to the core platform and learning the codebase.',
    url: '/issues/?repository=backstage/backstage',
    isExternal: false,
  },
  {
    title: 'Community Plugins Repository',
    description:
      'A collection of community-contributed plugins that extend Backstage functionality. Great place to find issues and contribute new features.',
    url: 'https://github.com/backstage/community-plugins',
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
    title: 'Community Plugins Issues',
    description:
      'View curated issues from the Community Plugins repository. Great for contributing to plugins and extending Backstage functionality.',
    url: '/issues/?repository=backstage/community-plugins',
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
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          👋 Welcome to the Backstage ContribFest!
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-secondary, #666)',
            lineHeight: '1.6',
          }}
        >
          Your guide to contributing to Backstage and Community Plugins. Explore resources,
          complete your setup checklist, and find issues to work on.
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '12px',
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Contrib-What?
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-secondary, #666)',
            lineHeight: '1.6',
          }}
        >
          ContribFest is a track at KubeCon where various CNCF projects will host hands-on
          sessions working with their respective communities on contributions towards their
          projects. You don&apos;t have to be a past contributor to participate — new community
          members are encouraged to join!
        </p>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-secondary, #666)',
            lineHeight: '1.6',
            marginTop: '12px',
          }}
        >
          These sessions are 75 minutes long and take place in a room with roughly a dozen
          circular tables that seat about eight people making it easy to work and collaborate.
          They usually lead off with some getting started steps and then give attendees the rest
          of the time to work on their contributions with the aid of experts from the project.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Session Resources
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {sessionResources.map((resource) => (
          <WelcomeCard key={resource.title} {...resource} />
        ))}
      </div>

      <div style={{ marginTop: '48px', marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Repository Resources
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {repositoryResources.map((resource) => (
          <WelcomeCard key={resource.title} {...resource} />
        ))}
      </div>
    </div>
  )
}
