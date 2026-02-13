'use client'

import { useState, useEffect } from 'react'
import { parseIssuesCSV } from '@/lib/csv-parser'
import { enrichIssuesWithGitHubData } from '@/lib/github-api'
import type { EnrichedIssue } from '@/lib/types'

interface UseIssuesResult {
  issues: EnrichedIssue[]
  loading: boolean
  error: string | null
  progress: { current: number; total: number } | null
}

export function useIssues(): UseIssuesResult {
  const [issues, setIssues] = useState<EnrichedIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadIssues() {
      try {
        setLoading(true)
        setError(null)

        // Step 1: Parse CSV
        const csvIssues = await parseIssuesCSV()

        if (!isMounted) return

        // Step 2: Enrich with GitHub data
        const enrichedIssues = await enrichIssuesWithGitHubData(
          csvIssues,
          (current, total) => {
            if (isMounted) {
              setProgress({ current, total })
            }
          }
        )

        if (!isMounted) return

        setIssues(enrichedIssues)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load issues')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setProgress(null)
        }
      }
    }

    loadIssues()

    return () => {
      isMounted = false
    }
  }, [])

  return { issues, loading, error, progress }
}
