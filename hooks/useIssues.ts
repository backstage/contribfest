'use client'

import { useState, useEffect, useCallback } from 'react'
import { parseIssuesCSV } from '@/lib/csv-parser'
import { enrichIssuesWithGitHubData } from '@/lib/github-api'
import type { EnrichedIssue } from '@/lib/types'

interface UseIssuesResult {
  issues: EnrichedIssue[]
  loading: boolean
  error: string | null
  progress: { current: number; total: number } | null
}

export function useIssues(shouldLoad = true): UseIssuesResult {
  const [issues, setIssues] = useState<EnrichedIssue[]>([])
  const [loading, setLoading] = useState(shouldLoad)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  const loadIssues = useCallback(async () => {
    if (!shouldLoad) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)

      // Step 1: Parse CSV
      const csvIssues = await parseIssuesCSV()

      // Step 2: Enrich with GitHub data
      const enrichedIssues = await enrichIssuesWithGitHubData(
        csvIssues,
        (current, total) => {
          setProgress({ current, total })
        }
      )

      setIssues(enrichedIssues)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues')
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }, [shouldLoad])

  useEffect(() => {
    if (shouldLoad) {
      loadIssues()
    }
  }, [loadIssues, shouldLoad])

  return { issues, loading, error, progress }
}
