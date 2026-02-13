'use client'

import { useEffect, useState } from 'react'
import type { Theme } from '@/lib/types'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Initialize theme from localStorage or system preference
    const stored = window.localStorage.getItem('contribfest-theme') as Theme | null
    if (stored) {
      document.documentElement.setAttribute('data-theme-mode', stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = prefersDark ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme-mode', theme)
      window.localStorage.setItem('contribfest-theme', theme)
    }
  }, [])

  // Prevent flash of wrong theme by not rendering until mounted
  if (!mounted) {
    return null
  }

  return <>{children}</>
}
