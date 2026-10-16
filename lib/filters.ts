import type { EnrichedIssue, IssueAvailability } from './types'

export interface FilterOptions {
  search: string
  repository: string // 'all' | 'backstage/backstage' | 'backstage/community-plugins'
  availability: string // 'all' | IssueAvailability
  level: string // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  label: string // 'all' | specific label name
}

export const availabilityOptions: Array<{ value: IssueAvailability; label: string }> = [
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'has-pr', label: 'Has PR' },
  { value: 'closed', label: 'Closed' },
]

// Sort order used to list available issues first
export function getAvailabilitySortOrder(availability?: IssueAvailability): number {
  const index = availabilityOptions.findIndex((option) => option.value === availability)
  return index === -1 ? availabilityOptions.length : index
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

    // Filter by availability
    if (filters.availability !== 'all') {
      if (issue.availability !== filters.availability) {
        return false
      }
    }

    // Filter by level
    if (filters.level !== 'all') {
      if (issue.level !== filters.level) {
        return false
      }
    }

    // Filter by label
    if (filters.label !== 'all' && issue.githubData) {
      const hasLabel = issue.githubData.labels.some(
        (label) => label.name === filters.label
      )
      if (!hasLabel) {
        return false
      }
    }

    return true
  })
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
