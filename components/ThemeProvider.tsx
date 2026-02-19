'use client'

import { useSyncExternalStore, useEffect } from 'react'
import type { Theme } from '@/lib/types'

function subscribe() { return () => {} }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const stored = window.localStorage.getItem('contribfest-theme') as Theme | null
    if (stored) {
      document.documentElement.setAttribute('data-theme-mode', stored)
    } else {
      document.documentElement.setAttribute('data-theme-mode', 'dark')
      window.localStorage.setItem('contribfest-theme', 'dark')
    }
  }, [])

  // Prevent flash of wrong theme by not rendering until mounted
  if (!mounted) {
    return null
  }

  return <>{children}</>
}
