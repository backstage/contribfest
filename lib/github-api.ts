import type { GitHubIssue, IssueRow, EnrichedIssue } from './types'

const GITHUB_API_BASE = 'https://api.github.com'

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

function buildIssueLookupMap(
  backstageIssues: GitHubIssue[],
  communityPluginsIssues: GitHubIssue[]
): Map<string, GitHubIssue> {
  const map = new Map<string, GitHubIssue>()

  // Add backstage/backstage issues
  backstageIssues.forEach((issue) => {
    const key = `backstage/backstage#${issue.number}`
    map.set(key, issue)
  })

  // Add backstage/community-plugins issues
  communityPluginsIssues.forEach((issue) => {
    const key = `backstage/community-plugins#${issue.number}`
    map.set(key, issue)
  })

  return map
}

export async function enrichIssuesWithGitHubData(
  issues: IssueRow[],
  onProgress?: (current: number, total: number) => void
): Promise<EnrichedIssue[]> {
  const enrichedIssues: EnrichedIssue[] = []

  // Report initial progress
  if (onProgress) {
    onProgress(0, issues.length)
  }

  try {
    // Step 1: Bulk fetch all contribfest issues from both repos
    console.log('Fetching contribfest issues from GitHub...')

    const [backstageIssues, communityPluginsIssues] = await Promise.all([
      fetchContribfestIssues('backstage', 'backstage'),
      fetchContribfestIssues('backstage', 'community-plugins'),
    ])

    console.log(`Total issues fetched: ${backstageIssues.length + communityPluginsIssues.length}`)

    // Step 2: Build lookup map
    const issueMap = buildIssueLookupMap(backstageIssues, communityPluginsIssues)

    // Step 3: Match CSV issues with GitHub data
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      const lookupKey = `${issue.repository}#${issue.issueId}`
      const githubData = issueMap.get(lookupKey)

      enrichedIssues.push({
        rowNumber: issue.rowNumber,
        repository: issue.repository,
        level: issue.level,
        issueId: issue.issueId,
        githubData: githubData || undefined,
        error: githubData ? undefined : 'Issue not found in GitHub or missing contribfest label',
      })

      // Report progress
      if (onProgress) {
        onProgress(i + 1, issues.length)
      }
    }

    console.log(`Matched ${enrichedIssues.filter(e => e.githubData).length}/${issues.length} issues with GitHub data`)
  } catch (error) {
    console.error('Error enriching issues with GitHub data:', error)

    // Fallback: return CSV data only
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      enrichedIssues.push({
        rowNumber: issue.rowNumber,
        repository: issue.repository,
        level: issue.level,
        issueId: issue.issueId,
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub data',
      })
    }
  }

  return enrichedIssues
}
