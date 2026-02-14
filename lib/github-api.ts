import type { GitHubIssue, IssueRow, EnrichedIssue } from './types'

const GITHUB_API_BASE = 'https://api.github.com'
const RATE_LIMIT_DELAY = 100 // 100ms delay between requests

// Helper to delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchIssueMetadata(
  repository: string,
  issueNumber: number
): Promise<GitHubIssue | null> {
  try {
    const [owner, repo] = repository.split('/')
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    // Add authentication token if available
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    if (token && token !== 'your_github_personal_access_token_here') {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache', // Cache responses for performance
    })

    if (!response.ok) {
      console.error(
        `Failed to fetch issue ${repository}#${issueNumber}: ${response.status} ${response.statusText} -${response.text()}`
      )
      return null
    }

    const data = await response.json()
    return data as GitHubIssue
  } catch (error) {
    console.error(`Error fetching issue ${repository}#${issueNumber}:`, error)
    return null
  }
}

export async function fetchContribfestIssues(
  owner: string,
  repo: string
): Promise<GitHubIssue[]> {
  const allIssues: GitHubIssue[] = []
  let page = 1
  const perPage = 100

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    if (token && token !== 'your_github_personal_access_token_here') {
      headers.Authorization = `Bearer ${token}`
    }

    while (true) {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?labels=contribfest&state=all&per_page=${perPage}&page=${page}`

      const response = await fetch(url, {
        headers,
        cache: 'force-cache',
      })

      if (!response.ok) {
        console.error(
          `Failed to fetch contribfest issues from ${owner}/${repo}: ${response.status} ${response.statusText}`
        )
        break
      }

      const issues = await response.json() as GitHubIssue[]

      if (issues.length === 0) {
        break
      }

      allIssues.push(...issues)

      // If we got fewer than perPage results, we've reached the end
      if (issues.length < perPage) {
        break
      }

      page++
    }

    console.log(`Fetched ${allIssues.length} contribfest issues from ${owner}/${repo}`)
    return allIssues
  } catch (error) {
    console.error(`Error fetching contribfest issues from ${owner}/${repo}:`, error)
    return []
  }
}

export async function enrichIssuesWithGitHubData(
  issues: IssueRow[],
  onProgress?: (current: number, total: number) => void
): Promise<EnrichedIssue[]> {
  const enrichedIssues: EnrichedIssue[] = []

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i]

    // Report progress
    if (onProgress) {
      onProgress(i + 1, issues.length)
    }

    try {
      const githubData = await fetchIssueMetadata(issue.repository, issue.issueId)

      enrichedIssues.push({
        rowNumber: issue.rowNumber,
        repository: issue.repository,
        level: issue.level,
        issueId: issue.issueId,
        githubData: githubData || undefined,
        error: githubData ? undefined : 'Failed to fetch issue data',
      })
    } catch (error) {
      enrichedIssues.push({
        rowNumber: issue.rowNumber,
        repository: issue.repository,
        level: issue.level,
        issueId: issue.issueId,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // Add delay between requests to respect rate limits
    if (i < issues.length - 1) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  return enrichedIssues
}
