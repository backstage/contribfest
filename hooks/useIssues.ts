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
  refresh: () => void
  lastUpdated: Date | null
}

interface CachedData {
  issues: EnrichedIssue[]
  timestamp: number
}

const CACHE_KEY = 'github-issues-cache'
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds

export function useIssues(): UseIssuesResult {
  const [issues, setIssues] = useState<EnrichedIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadIssues = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { issues: cachedIssues, timestamp }: CachedData = JSON.parse(cached)
          const age = Date.now() - timestamp

          if (age < CACHE_DURATION) {
            setIssues(cachedIssues)
            setLastUpdated(new Date(timestamp))
            setLoading(false)
            return
          }
        }
      }

      // Step 1: Parse CSV
      const csvIssues = await parseIssuesCSV()

      // Step 2: Enrich with GitHub data
      const enrichedIssues = await enrichIssuesWithGitHubData(
        csvIssues,
        (current, total) => {
          setProgress({ current, total })
        }
      )

      // Cache the results
      const cacheData: CachedData = {
        issues: enrichedIssues,
        timestamp: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

      setIssues(enrichedIssues)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues')
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }, [])

  useEffect(() => {
    loadIssues(refreshTrigger > 0)
  }, [loadIssues, refreshTrigger])

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return { issues, loading, error, progress, refresh, lastUpdated }
}
