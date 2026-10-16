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

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    fetchSnapshot<GitHubPullRequest>('pull-requests')
      .then((snapshot) => {
        if (ignore) return
        setPullRequests(snapshot.items)
        setGeneratedAt(snapshot.generatedAt)
      })
      .catch((err) => {
        if (ignore) return
        setError(err instanceof Error ? err.message : 'Failed to load pull requests')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [reloadKey])

  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  return {
    pullRequests,
    generatedAt,
    loading,
    error,
    refresh,
  }
}
