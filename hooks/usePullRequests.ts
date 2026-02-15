'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GitHubPullRequest } from '@/lib/types'

interface UsePullRequestsReturn {
  pullRequests: GitHubPullRequest[]
  loading: boolean
  error: string | null
  refresh: () => void
}

async function fetchContribfestPullRequests(
  owner: string,
  repo: string
): Promise<GitHubPullRequest[]> {
  const allPRs: GitHubPullRequest[] = []
  let page = 1
  const perPage = 100

  console.log(`Searching for merged contribfest PRs in ${owner}/${repo}...`)

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    // Token is optional - works without it but with lower rate limits
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    if (token && token !== 'your_github_personal_access_token_here') {
      headers.Authorization = `Bearer ${token}`
      console.log('Using GitHub token for authentication')
    } else {
      console.log('No GitHub token - using unauthenticated requests (lower rate limits)')
    }

    while (true) {
      // Use search API to filter for merged PRs with contribfest label
      const query = `repo:${owner}/${repo} is:pr is:merged label:contribfest`
      const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`
      console.log(`Searching page ${page} from ${owner}/${repo}`)

      const response = await fetch(url, {
        headers,
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error(
          `Failed to search PRs from ${owner}/${repo}: ${response.status} ${response.statusText}`
        )
        break
      }

      const data = await response.json() as { total_count: number; items: GitHubPullRequest[] }
      const prs = data.items
      console.log(`Found ${prs.length} PRs from ${owner}/${repo} page ${page} (total: ${data.total_count})`)

      if (prs.length === 0) {
        break
      }

      // Add repository identifier
      prs.forEach(pr => {
        pr.repository = `${owner}/${repo}`
      })

      allPRs.push(...prs)

      // If we got fewer than perPage results, we've reached the end
      if (prs.length < perPage) {
        break
      }

      page++
    }

    console.log(`Total merged contribfest PRs from ${owner}/${repo}: ${allPRs.length}`)
    return allPRs
  } catch (error) {
    console.error(`Error searching PRs from ${owner}/${repo}:`, error)
    return []
  }
}

export function usePullRequests(): UsePullRequestsReturn {
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPRs = useCallback(async () => {
    console.log('Starting to fetch pull requests...')
    setLoading(true)
    setError(null)

    try {
      const [backstagePRs, communityPluginsPRs] = await Promise.all([
        fetchContribfestPullRequests('backstage', 'backstage'),
        fetchContribfestPullRequests('backstage', 'community-plugins'),
      ])

      const allPRs = [...backstagePRs, ...communityPluginsPRs]

      // Sort by created_at descending (newest first)
      allPRs.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      console.log(`Total PRs after combining and sorting: ${allPRs.length}`)
      setPullRequests(allPRs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pull requests'
      setError(errorMessage)
      console.error('Error fetching PRs:', err)
    } finally {
      setLoading(false)
      console.log('Finished fetching pull requests')
    }
  }, [])

  useEffect(() => {
    fetchPRs()
  }, [fetchPRs])

  const refresh = useCallback(() => {
    fetchPRs()
  }, [fetchPRs])

  return {
    pullRequests,
    loading,
    error,
    refresh,
  }
}
