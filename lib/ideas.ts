// Content for the "Your Ideas" page. Everything here helps attendees shape
// their own ideas. Nothing on the page writes proposals for them.

const BACKSTAGE_ISSUES = 'https://github.com/backstage/backstage/issues'

// Most-upvoted open issues are a good signal of what adopters want
function popularIssuesUrl(query: string): string {
  return `${BACKSTAGE_ISSUES}?q=${encodeURIComponent(`is:issue is:open ${query} sort:reactions-+1-desc`)}`
}

export type IdeaPathId = 'feature-request' | 'bep' | 'existing-plugin' | 'new-plugin'

export interface IdeaPath {
  id: IdeaPathId
  title: string
  summary: string
  steps: string[]
  links: Array<{ label: string; url: string }>
}

export const ideaPaths: Record<IdeaPathId, IdeaPath> = {
  'feature-request': {
    id: 'feature-request',
    title: 'Suggest a change',
    summary:
      'Most ideas start here. A suggestion issue gets your idea in front of maintainers and adopters quickly, and can be converted into a BEP later if it grows.',
    steps: [
      'Search existing issues first. Adding your use case to an existing thread is a contribution too.',
      'Describe the problem before the solution: who hits it, how often, and what they do today.',
      'Keep it short. Maintainers respond best to clear, concise proposals.',
    ],
    links: [
      { label: 'Open a suggestion issue', url: `${BACKSTAGE_ISSUES}/new?template=03_suggestion.yaml` },
      { label: 'Most-upvoted open suggestions', url: popularIssuesUrl('label:type:suggestion') },
    ],
  },
  bep: {
    id: 'bep',
    title: 'Write a Backstage Enhancement Proposal (BEP)',
    summary:
      'For larger changes to the Backstage framework or core features, where design decisions need to be agreed up front and the work spans several PRs.',
    steps: [
      'Discuss the idea first on Discord, in a SIG meeting, or in a suggestion issue, and find maintainers who think it is worth doing.',
      'Copy the BEP template folder to beps/NNNN-short-descriptive-title and fill it in yourself.',
      'Open a PR titled "BEP: <title>". Focus on clarifying the goals; details can be iterated on.',
    ],
    links: [
      { label: 'BEP process', url: 'https://github.com/backstage/backstage/blob/master/beps/README.md' },
      { label: 'BEP template', url: 'https://github.com/backstage/backstage/tree/master/beps/NNNN-template' },
      { label: 'Existing BEPs', url: 'https://github.com/backstage/backstage/tree/master/beps' },
      { label: 'Issues that need a BEP', url: `${BACKSTAGE_ISSUES}?q=${encodeURIComponent('is:issue is:open label:needs:bep')}` },
    ],
  },
  'existing-plugin': {
    id: 'existing-plugin',
    title: 'Improve an existing plugin',
    summary:
      'Plugin ideas do not need a BEP. Open a feature request on the repository the plugin lives in, then work toward a PR with its maintainers.',
    steps: [
      'Find where the plugin lives: backstage/backstage, backstage/community-plugins, or a third-party repository.',
      'Check the plugin\'s open issues and recent PRs to see what its maintainers are focused on.',
      'Open a feature request describing the problem, and offer to implement it.',
    ],
    links: [
      { label: 'Community Plugins feature request', url: 'https://github.com/backstage/community-plugins/issues/new?template=2-feature.yaml' },
      { label: 'Backstage suggestion issue', url: `${BACKSTAGE_ISSUES}/new?template=03_suggestion.yaml` },
      { label: 'Plugin directory', url: 'https://backstage.io/plugins' },
    ],
  },
  'new-plugin': {
    id: 'new-plugin',
    title: 'Propose a new community plugin',
    summary:
      'New plugins in the Community Plugins repository start with a proposal issue, so the community can confirm there is interest and nothing similar already exists.',
    steps: [
      'Check the plugin directory and Community Plugins for anything similar you could extend instead.',
      'Read the "Contributing a New Plugin" guide, including the maintainer expectations.',
      'Open a plugin proposal issue describing what it does and who would use it.',
    ],
    links: [
      { label: 'Contributing a new plugin', url: 'https://github.com/backstage/community-plugins/blob/main/docs/contributing-new-plugin.md' },
      { label: 'Open a plugin proposal', url: 'https://github.com/backstage/community-plugins/issues/new?template=3-plugin.yaml' },
      { label: 'Plugin directory', url: 'https://backstage.io/plugins' },
    ],
  },
}

export interface TopicArea {
  title: string
  emoji: string
  summary: string
  questions: string[]
  docsUrl: string
  codeUrl: string
  issuesUrl: string
}

export const topicAreas: TopicArea[] = [
  {
    title: 'Software Catalog',
    emoji: '📚',
    summary: 'The heart of Backstage: entities, relations, processors, and providers.',
    questions: [
      'What metadata does your organization wish the catalog modeled?',
      'Which ingestion source is missing or painful to configure?',
    ],
    docsUrl: 'https://backstage.io/docs/features/software-catalog/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/catalog-backend',
    issuesUrl: popularIssuesUrl('label:area:catalog'),
  },
  {
    title: 'Software Templates',
    emoji: '🏗️',
    summary: 'The Scaffolder: templates, actions, and the task engine behind them.',
    questions: [
      'Which scaffolder action do you keep rewriting in-house?',
      'What would make templates easier to test, debug, or maintain?',
    ],
    docsUrl: 'https://backstage.io/docs/features/software-templates/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend',
    issuesUrl: popularIssuesUrl('label:area:scaffolder'),
  },
  {
    title: 'TechDocs',
    emoji: '📝',
    summary: 'Docs-like-code: building, publishing, and reading documentation in Backstage.',
    questions: [
      'What stops your teams from keeping docs next to their code?',
      'Which reader experience would make docs easier to navigate?',
    ],
    docsUrl: 'https://backstage.io/docs/features/techdocs/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/techdocs',
    issuesUrl: popularIssuesUrl('label:area:techdocs'),
  },
  {
    title: 'Search',
    emoji: '🔎',
    summary: 'Collators, search engines, and the search experience across plugins.',
    questions: [
      'What do your users search for and fail to find?',
      'Which search engine or collator integration is missing?',
    ],
    docsUrl: 'https://backstage.io/docs/features/search/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/search-backend',
    issuesUrl: popularIssuesUrl('label:area:search'),
  },
  {
    title: 'New Frontend System',
    emoji: '🧩',
    summary: 'Extensions, blueprints, and the declarative app that replaces the legacy frontend.',
    questions: [
      'What was hard about migrating your app or plugins?',
      'Which extension point or blueprint would you add?',
    ],
    docsUrl: 'https://backstage.io/docs/frontend-system/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/packages/frontend-plugin-api',
    issuesUrl: popularIssuesUrl('label:area:framework'),
  },
  {
    title: 'Backend System',
    emoji: '⚙️',
    summary: 'Services, extension points, and plugin modules on the backend.',
    questions: [
      'Which core service would make your backend plugins simpler?',
      'What do you wish you could observe or configure at runtime?',
    ],
    docsUrl: 'https://backstage.io/docs/backend-system/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/packages/backend-plugin-api',
    issuesUrl: popularIssuesUrl('label:area:framework'),
  },
  {
    title: 'Backstage UI (BUI)',
    emoji: '🎨',
    summary: 'The new design system and component library replacing Material UI.',
    questions: [
      'Which component is missing when you build plugin UIs?',
      'Where do BUI docs or theming fall short for your use case?',
    ],
    docsUrl: 'https://ui.backstage.io/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/packages/ui',
    issuesUrl: popularIssuesUrl('label:area:design-system'),
  },
  {
    title: 'Auth & Permissions',
    emoji: '🔐',
    summary: 'Sign-in providers, identity resolution, and the permission framework.',
    questions: [
      'Which identity provider or sign-in flow is hard to set up?',
      'What authorization rule can you not express today?',
    ],
    docsUrl: 'https://backstage.io/docs/permissions/overview',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/permission-backend',
    issuesUrl: popularIssuesUrl('label:area:permission'),
  },
  {
    title: 'Notifications',
    emoji: '🔔',
    summary: 'Sending, routing, and displaying notifications from plugins.',
    questions: [
      'Which events should notify your developers but don\'t?',
      'Which delivery channel or preference setting is missing?',
    ],
    docsUrl: 'https://backstage.io/docs/notifications/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/notifications-backend',
    issuesUrl: popularIssuesUrl('label:area:notifications'),
  },
  {
    title: 'AI & MCP Actions',
    emoji: '🤖',
    summary: 'Exposing Backstage capabilities to AI agents through the actions registry and MCP.',
    questions: [
      'Which Backstage data or workflow would you want an agent to use safely?',
      'How should permissions and auditing apply to AI-driven actions?',
    ],
    docsUrl: 'https://backstage.io/docs/ai/',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/plugins/mcp-actions-backend',
    issuesUrl: popularIssuesUrl('MCP in:title,body'),
  },
  {
    title: 'Accessibility & i18n',
    emoji: '🌍',
    summary: 'Making Backstage usable for everyone, in every language.',
    questions: [
      'Which screens fail keyboard or screen reader use?',
      'Which plugins still have hard-coded strings that need translation refs?',
    ],
    docsUrl: 'https://backstage.io/docs/accessibility/',
    codeUrl: 'https://backstage.io/docs/plugins/internationalization',
    issuesUrl: popularIssuesUrl('accessibility OR i18n in:title,body'),
  },
  {
    title: 'CLI & Tooling',
    emoji: '🛠️',
    summary: 'The backstage-cli, repo tooling, and the developer experience of building Backstage apps.',
    questions: [
      'Which upgrade or build step wastes the most time for your team?',
      'What would make creating and testing plugins faster?',
    ],
    docsUrl: 'https://backstage.io/docs/tooling/cli/overview',
    codeUrl: 'https://github.com/backstage/backstage/tree/master/packages/cli',
    issuesUrl: popularIssuesUrl('label:area:tooling'),
  },
]

// Prompts to think through an idea. They mirror the BEP template sections so
// the notes carry over, but the attendee writes every word.
export interface CanvasQuestion {
  id: string
  heading: string
  prompt: string
}

export const canvasQuestions: CanvasQuestion[] = [
  {
    id: 'problem',
    heading: 'Problem',
    prompt: 'What problem have you run into? Describe it without mentioning your solution.',
  },
  {
    id: 'who',
    heading: 'Who is affected',
    prompt: 'Who hits this problem (adopters, plugin authors, end users), and how often?',
  },
  {
    id: 'goals',
    heading: 'Goals',
    prompt: 'What would be true once this is solved?',
  },
  {
    id: 'non-goals',
    heading: 'Non-goals',
    prompt: 'What are you deliberately leaving out of scope?',
  },
  {
    id: 'proposal',
    heading: 'Rough proposal',
    prompt: 'How might it work? A few sentences is plenty for now.',
  },
  {
    id: 'alternatives',
    heading: 'Alternatives considered',
    prompt: 'What else could solve this, including workarounds people use today?',
  },
  {
    id: 'questions',
    heading: 'Open questions',
    prompt: 'What don\'t you know yet? Who could you ask?',
  },
]

// Prompts for the attendee's own AI assistant. Each one asks the AI to
// explain, search, question, or critique, never to write the proposal.
export interface CoachPrompt {
  title: string
  purpose: string
  prompt: string
}

export const coachPrompts: CoachPrompt[] = [
  {
    title: 'Understand the code',
    purpose: 'Get oriented in an unfamiliar part of the codebase.',
    prompt:
      'I\'m exploring the Backstage codebase (github.com/backstage/backstage). Explain how [area, e.g. catalog entity processing] works and point me to the specific packages and files I should read. Flag anything you are unsure about so I can verify it in the docs at backstage.io/docs.',
  },
  {
    title: 'Find prior art',
    purpose: 'Avoid duplicating work that already exists or was rejected.',
    prompt:
      'Before I propose [your idea] to the Backstage project, help me look for prior art: existing BEPs in the beps/ folder, open or closed GitHub issues, community plugins, and docs that already cover something similar. List what you find with links, and say clearly when you could not verify something.',
  },
  {
    title: 'Challenge my thinking',
    purpose: 'Stress-test your notes before sharing them with maintainers.',
    prompt:
      'Here are my notes for a Backstage proposal: [paste your Idea Canvas notes]. Act as a skeptical Backstage maintainer. Do not rewrite my notes. Ask me the five hardest questions you would want answered before supporting this, focusing on motivation, scope, and alternatives.',
  },
  {
    title: 'Find a first step',
    purpose: 'Turn a big idea into something you can start on today.',
    prompt:
      'My idea for Backstage is: [your idea]. Help me break it down. What is the smallest independently useful first step I could ship as a single PR, and which parts would need a design discussion or BEP first? Ask me questions rather than writing code.',
  },
  {
    title: 'Check my understanding',
    purpose: 'Make sure you can explain every line before you open a PR.',
    prompt:
      'I\'m about to open a PR to Backstage. Here is a summary of my change: [describe your change]. Quiz me on it. Ask questions until you are confident I can explain why every part of the change is needed and how I tested it.',
  },
]

export const aiPolicyUrl =
  'https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#ai-use-policy-and-guidelines'

export const aiPolicyPoints = [
  'AI tools are welcome, but you must understand and be able to explain every change you propose.',
  'Never submit an AI-generated PR you haven\'t personally understood and tested.',
  'If a PR is largely AI-generated, say so clearly in the description.',
  'Write PR descriptions and review replies yourself, focused on the why. Keep them concise.',
]

export const nextSteps: Array<{ title: string; description: string; link?: { label: string; url: string } }> = [
  {
    title: 'Talk to a host',
    description: 'Grab one of today\'s hosts to sanity-check your idea and find the right people to talk to.',
  },
  {
    title: 'Discuss with the community',
    description: 'Share the problem on Discord or bring it to a SIG meeting before writing a formal proposal.',
    link: { label: 'Join the Backstage Discord', url: 'https://discord.gg/backstage-687207715902193673' },
  },
  {
    title: 'Write it up yourself',
    description: 'Open the suggestion issue, plugin proposal, or BEP in your own words. Your notes from the canvas are a starting point.',
  },
  {
    title: 'Ship a first small PR',
    description: 'Small, focused PRs that move toward the idea build trust and momentum.',
    link: { label: 'Contribution guide', url: 'https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md' },
  },
  {
    title: 'Keep going after KubeCon',
    description: 'Respond to review feedback, join community sessions, and keep your idea moving.',
    link: { label: 'Community sessions & SIGs', url: 'https://github.com/backstage/community' },
  },
]
