'use client'

import { useTheme } from '@/hooks/useTheme'
import { RiMoonLine, RiSunLine } from '@remixicon/react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '4px',
        background: 'var(--bui-bg-app, #f8f8f8)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <>
          <RiMoonLine size={16} />
          Dark Mode
        </>
      ) : (
        <>
          <RiSunLine size={16} />
          Light Mode
        </>
      )}
    </button>
  )
}
