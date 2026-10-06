'use client'

import { useState, useEffect } from 'react'
import { fetchSnapshot } from '@/lib/snapshot'
import type { EnrichedIssue, Snapshot } from '@/lib/types'

interface UseIssuesResult {
  issues: EnrichedIssue[]
  generatedAt: string | null
  loading: boolean
  error: string | null
}

export function useIssues(shouldLoad = true): UseIssuesResult {
  const [snapshot, setSnapshot] = useState<Snapshot<EnrichedIssue> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldLoad) return

    let cancelled = false
    fetchSnapshot<EnrichedIssue>('issues')
      .then((result) => {
        if (!cancelled) setSnapshot(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load issues')
      })

    return () => {
      cancelled = true
    }
  }, [shouldLoad])

  return {
    issues: snapshot?.items ?? [],
    generatedAt: snapshot?.generatedAt ?? null,
    loading: shouldLoad && !snapshot && !error,
    error,
  }
}
