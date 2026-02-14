import type { EnrichedIssue } from './types'

export interface FilterOptions {
  search: string
  repository: string // 'all' | 'backstage/backstage' | 'backstage/community-plugins'
  state: string // 'all' | 'open' | 'closed'
  author: string // 'all' | specific author login
  level: string // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
}

export function filterIssues(
  issues: EnrichedIssue[],
  filters: FilterOptions
): EnrichedIssue[] {
  return issues.filter((issue) => {
    // Filter by search (title)
    if (filters.search && issue.githubData) {
      const searchLower = filters.search.toLowerCase()
      const titleLower = issue.githubData.title.toLowerCase()
      if (!titleLower.includes(searchLower)) {
        return false
      }
    }

    // Filter by repository
    if (filters.repository !== 'all') {
      if (issue.repository !== filters.repository) {
        return false
      }
    }

    // Filter by state
    if (filters.state !== 'all' && issue.githubData) {
      if (issue.githubData.state !== filters.state) {
        return false
      }
    }

    // Filter by author
    if (filters.author !== 'all' && issue.githubData) {
      if (issue.githubData.user.login !== filters.author) {
        return false
      }
    }

    // Filter by level
    if (filters.level !== 'all') {
      if (issue.level !== filters.level) {
        return false
      }
    }

    return true
  })
}

export function getUniqueAuthors(issues: EnrichedIssue[]): string[] {
  const authors = new Set<string>()

  issues.forEach((issue) => {
    if (issue.githubData?.user.login) {
      authors.add(issue.githubData.user.login)
    }
  })

  return Array.from(authors).sort()
}

export function getUniqueLabels(issues: EnrichedIssue[]): string[] {
  const labels = new Set<string>()

  issues.forEach((issue) => {
    if (issue.githubData?.labels) {
      issue.githubData.labels.forEach((label) => {
        labels.add(label.name)
      })
    }
  })

  return Array.from(labels).sort()
}

export function getUniqueRepositories(issues: EnrichedIssue[]): string[] {
  const repositories = new Set<string>()

  issues.forEach((issue) => {
    repositories.add(issue.repository)
  })

  return Array.from(repositories).sort()
}

export function getUniqueLevels(issues: EnrichedIssue[]): string[] {
  const levels = new Set<string>()

  issues.forEach((issue) => {
    if (issue.level) {
      levels.add(issue.level)
    }
  })

  // Sort by difficulty order, not alphabetically
  const levelOrder = ['Beginner', 'Intermediate', 'Advanced']
  return Array.from(levels).sort((a, b) =>
    levelOrder.indexOf(a) - levelOrder.indexOf(b)
  )
}
