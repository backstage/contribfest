import type { GitHubPullRequest } from './types'

const GITHUB_API_BASE = 'https://api.github.com'

export async function fetchContribfestPullRequests(
  owner: string,
  repo: string
): Promise<GitHubPullRequest[]> {
  const allPRs: GitHubPullRequest[] = []
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
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=closed&per_page=${perPage}&page=${page}`

      const response = await fetch(url, {
        headers,
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error(
          `Failed to fetch PRs from ${owner}/${repo}: ${response.status} ${response.statusText}`
        )
        break
      }

      const prs = await response.json() as GitHubPullRequest[]

      if (prs.length === 0) {
        break
      }

      // Filter to only merged PRs with contribfest label
      const mergedContribfestPRs = prs.filter(pr => {
        const hasContribfestLabel = pr.labels?.some(label =>
          label.name === 'contribfest'
        )
        return pr.merged_at !== null && hasContribfestLabel
      })

      // Add repository identifier
      mergedContribfestPRs.forEach(pr => {
        pr.repository = `${owner}/${repo}`
      })

      allPRs.push(...mergedContribfestPRs)

      // If we got fewer than perPage results, we've reached the end
      if (prs.length < perPage) {
        break
      }

      page++
    }

    console.log(`Fetched ${allPRs.length} merged contribfest PRs from ${owner}/${repo}`)
    return allPRs
  } catch (error) {
    console.error(`Error fetching PRs from ${owner}/${repo}:`, error)
    return []
  }
}

export async function fetchAllContribfestPullRequests(): Promise<GitHubPullRequest[]> {
  console.log('Fetching contribfest PRs from GitHub...')

  const [backstagePRs, communityPluginsPRs] = await Promise.all([
    fetchContribfestPullRequests('backstage', 'backstage'),
    fetchContribfestPullRequests('backstage', 'community-plugins'),
  ])

  const allPRs = [...backstagePRs, ...communityPluginsPRs]

  // Sort by created_at descending (newest first)
  allPRs.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  console.log(`Total merged contribfest PRs: ${allPRs.length}`)
  return allPRs
}
