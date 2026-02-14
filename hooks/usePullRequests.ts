'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GitHubPullRequest } from '@/lib/types'
import { fetchAllContribfestPullRequests } from '@/lib/github-pr-api'

interface UsePullRequestsReturn {
  pullRequests: GitHubPullRequest[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function usePullRequests(): UsePullRequestsReturn {
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPRs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const prs = await fetchAllContribfestPullRequests()
      setPullRequests(prs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pull requests'
      setError(errorMessage)
      console.error('Error fetching PRs:', err)
    } finally {
      setLoading(false)
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
