'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'
import { BackstageLogo } from './BackstageLogo'
import { ThemeToggle } from './ThemeToggle'

const navigationLinks = [
  { href: '/', label: 'Welcome', emoji: '👋' },
  { href: '/getting-started/', label: 'Getting Started', emoji: '🚀' },
  { href: '/issues/', label: 'Curated Issues', emoji: '🔍' },
  { href: '/contrib-champs/', label: 'Contrib Champs', emoji: '🏆' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLElement>(null)

  // Focus the sidebar when it opens on mobile
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus()
    }
  }, [isOpen])

  return (
    <aside
      ref={sidebarRef}
      id="sidebar-nav"
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
      tabIndex={-1}
    >
      {/* Backstage Logo */}
      <div style={{ marginBottom: '24px', padding: '0 4px' }}>
        <Link href="/" style={{ display: 'block', cursor: 'pointer' }} onClick={onClose}>
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
      <nav aria-label="Site pages" style={{ flex: 1 }}>
        <ul
          role="list"
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
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
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
                  <span aria-hidden="true" style={{ marginRight: '8px' }}>{link.emoji}</span>
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
