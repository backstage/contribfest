'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const navigationLinks = [
  { href: '/', label: 'Welcome' },
  { href: '/getting-started/', label: 'Getting Started' },
  { href: '/issues/', label: 'Issues' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '250px',
        minHeight: '100vh',
        padding: '24px 16px',
        borderRight: '1px solid var(--border-color, #e0e0e0)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary, #ffffff)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: 0,
            color: 'var(--text-primary, #000)',
          }}
        >
          ContribFest
        </h1>
        <p
          style={{
            fontSize: '12px',
            margin: '4px 0 0 0',
            color: 'var(--text-secondary, #666)',
          }}
        >
          Backstage Contribution Guide
        </p>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1 }}>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href} style={{ marginBottom: '8px' }}>
                <Link
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: isActive
                      ? 'var(--link-active, #1976d2)'
                      : 'var(--text-primary, #000)',
                    background: isActive
                      ? 'var(--bg-active, #e3f2fd)'
                      : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div style={{ marginTop: 'auto' }}>
        <ThemeToggle />
      </div>
    </aside>
  )
}
