// CSV row format: {row_number}→{repository},{issue_id}
export interface IssueRow {
  rowNumber: number
  repository: string
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
  issueId: number
  githubData?: GitHubIssue
  error?: string
}

// Checklist item
export interface ChecklistItem {
  id: string
  label: string
  link?: string
  completed: boolean
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
