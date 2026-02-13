'use client'

import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Theme } from '@/lib/types'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('contribfest-theme', 'light')

  // Apply theme to HTML element whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme-mode', theme)
    }
  }, [theme])

  // Initialize theme from system preference if not set
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('contribfest-theme')
      if (!stored) {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    }
  }, [setTheme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}
