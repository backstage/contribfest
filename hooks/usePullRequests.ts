'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchSnapshot } from '@/lib/snapshot'
import type { GitHubPullRequest } from '@/lib/types'

interface UsePullRequestsReturn {
  pullRequests: GitHubPullRequest[]
  generatedAt: string | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function usePullRequests(): UsePullRequestsReturn {
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([])
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPRs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const snapshot = await fetchSnapshot<GitHubPullRequest>('pull-requests')
      setPullRequests(snapshot.items)
      setGeneratedAt(snapshot.generatedAt)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pull requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPRs()
  }, [fetchPRs])

  return {
    pullRequests,
    generatedAt,
    loading,
    error,
    refresh: fetchPRs,
  }
}
