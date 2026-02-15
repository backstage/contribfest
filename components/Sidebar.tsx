'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BackstageLogo } from './BackstageLogo'
import { ThemeToggle } from './ThemeToggle'

const navigationLinks = [
  { href: '/', label: 'Welcome' },
  { href: '/getting-started/', label: 'Getting Started' },
  { href: '/issues/', label: 'Curated Issues' },
  { href: '/contrib-champs/', label: 'Contrib Champs' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '250px',
        padding: '24px 16px',
        borderRight: '1px solid var(--bui-border-1, #d5d5d5)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bui-bg-popover, #ffffff)',
      }}
    >
      {/* Backstage Logo */}
      <div style={{ marginBottom: '24px', padding: '0 4px' }}>
        <Link href="/" style={{ display: 'block', cursor: 'pointer' }}>
          <BackstageLogo />
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: 0,
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          ContribFest
        </h1>
        <p
          style={{
            fontSize: '12px',
            margin: '4px 0 0 0',
            color: 'var(--bui-fg-secondary, #666)',
          }}
        >
          Backstage Contributions
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
                      ? 'var(--bui-bg-solid, #1f5493)'
                      : 'var(--bui-fg-primary, #000)',
                    background: isActive
                      ? 'var(--bui-bg-info, #dbeafe)'
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
