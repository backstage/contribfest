// CSV row format: {row_number}→{repo},{level},{issue_id}
export interface IssueRow {
  rowNumber: number
  repository: string
  level: string
  issueId: number
}

// GitHub API issue response
export interface GitHubIssue {
  id: number
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
  body?: string
}

// Combined data: CSV + GitHub metadata
export interface EnrichedIssue {
  rowNumber: number
  repository: string
  level: string
  issueId: number
  githubData?: GitHubIssue
  error?: string
}

// Checklist item
export interface ChecklistItem {
  id: string
  label: string
  link?: string
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
}

// GitHub API pull request response
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
}
