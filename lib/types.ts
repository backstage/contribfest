// GitHub issue data from the build-time snapshot (scripts/fetch-github-data.mjs)
export interface GitHubIssue {
  number: number
  title: string
  state: 'open' | 'closed'
  html_url: string
  user: {
    login: string
    avatar_url?: string
  }
  labels: Array<{
    name: string
    color: string
  }>
  created_at: string
  updated_at: string
}

// Whether someone has already picked up a curated issue
export type IssueAvailability = 'available' | 'assigned' | 'has-pr' | 'closed'

// A pull request that would close a curated issue
export interface LinkedPullRequest {
  number: number
  url: string
  state: 'open' | 'merged'
  author: string
}

// Combined data: CSV + GitHub metadata
export interface EnrichedIssue {
  rowNumber: number
  repository: string
  level: string
  issueId: number
  availability?: IssueAvailability
  assignees?: string[]
  linkedPRs?: LinkedPullRequest[]
  githubData?: GitHubIssue
  error?: string
}

// Shape of the JSON files in public/data/
export interface Snapshot<T> {
  generatedAt: string
  items: T[]
}

// Checklist item
export interface ChecklistItem {
  id: string
  label: string
  link?: string
  icon?: string
  description?: string
  completed: boolean
  children?: ChecklistItem[]
}

// Theme type
export type Theme = 'light' | 'dark'

// Resource card for welcome page
export interface ResourceCard {
  title: string
  description: string
  url: string
  isExternal: boolean
  note?: string
}

// GitHub pull request data from the build-time snapshot
export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  state: string
  html_url: string
  user: {
    login: string
    html_url: string
  }
  labels?: Array<{
    name: string
    color: string
  }>
  created_at: string
  merged_at: string | null
  repository: string  // Added during processing to identify source repo
}

// ContribFest session information
export interface ContribFestSession {
  location: string
  subtitle?: string
  date: string
  blogUrl: string
  comingSoon?: boolean
  linkText?: string
  sched?: string  // e.g. "https://kccncna2024.sched.com/event/..."
}

// Hall of Hosts — individual host record
export interface Host {
  name: string
  title: string
  company: string
  kubecon: string       // e.g. "KubeCon NA 2024 – Salt Lake City"
  imagePath: string     // e.g. "/img/hosts/jane-doe.jpg"
  linkedinUrl?: string  // e.g. "https://www.linkedin.com/in/username"
}

// Pinned issue card data
export interface PinnedIssue {
  issueId: number
  repository: string
  level: string
  title: string
}
