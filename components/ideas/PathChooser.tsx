'use client'

import { useState } from 'react'
import { RiExternalLinkLine } from '@remixicon/react'
import { ideaPaths } from '@/lib/ideas'
import type { IdeaPathId } from '@/lib/ideas'

type Location = 'core' | 'existing-plugin' | 'new-plugin'
type Size = 'focused' | 'large'

const locationOptions: Array<{ value: Location; label: string }> = [
  { value: 'core', label: 'In Backstage itself: the framework or a core feature like the catalog, scaffolder, or auth' },
  { value: 'existing-plugin', label: 'In a plugin that already exists' },
  { value: 'new-plugin', label: 'In a brand-new plugin' },
]

const sizeOptions: Array<{ value: Size; label: string }> = [
  { value: 'focused', label: 'A focused improvement I can describe in an issue' },
  { value: 'large', label: 'A larger design that spans several PRs and needs maintainer sign-off' },
]

function getRecommendedPath(location: Location | null, size: Size | null): IdeaPathId | null {
  if (location === 'existing-plugin' || location === 'new-plugin') return location
  if (location === 'core' && size === 'focused') return 'feature-request'
  if (location === 'core' && size === 'large') return 'bep'
  return null
}

export function PathChooser() {
  const [location, setLocation] = useState<Location | null>(null)
  const [size, setSize] = useState<Size | null>(null)
  const pathId = getRecommendedPath(location, size)
  const path = pathId ? ideaPaths[pathId] : null

  return (
    <div>
      <OptionGroup
        legend="Where would your idea live?"
        options={locationOptions}
        selected={location}
        onSelect={(value) => {
          setLocation(value)
          setSize(null)
        }}
      />

      {location === 'core' && (
        <OptionGroup legend="How big is it?" options={sizeOptions} selected={size} onSelect={setSize} />
      )}

      {location === 'core' && !size && (
        <p style={{ fontSize: '14px', color: 'var(--bui-fg-secondary, #666)', margin: '0 0 16px' }}>
          Not sure? Start with a suggestion issue. It can always be turned into a BEP later.
        </p>
      )}

      {path && (
        <div
          aria-live="polite"
          style={{
            border: '2px solid var(--bui-bg-solid, #1f5493)',
            borderRadius: '8px',
            padding: '20px',
            background: 'var(--bui-bg-popover, #fff)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--bui-fg-secondary, #666)' }}>
            Recommended path
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0 8px', color: 'var(--bui-fg-primary, #000)' }}>
            {path.title}
          </h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--bui-fg-secondary, #666)', margin: '0 0 12px' }}>
            {path.summary}
          </p>
          <ol style={{ paddingLeft: '20px', margin: '0 0 16px', fontSize: '15px', lineHeight: '1.6', color: 'var(--bui-fg-primary, #000)' }}>
            {path.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {path.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: 'var(--bui-bg-solid, #1f5493)' }}
              >
                {link.label}
                <RiExternalLinkLine size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface OptionGroupProps<T extends string> {
  legend: string
  options: Array<{ value: T; label: string }>
  selected: T | null
  onSelect: (value: T) => void
}

function OptionGroup<T extends string>({ legend, options, selected, onSelect }: OptionGroupProps<T>) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: '0 0 16px' }}>
      <legend style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--bui-fg-primary, #000)' }}>
        {legend}
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((option) => {
          const isSelected = option.value === selected
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `${isSelected ? 2 : 1}px solid ${isSelected ? 'var(--bui-bg-solid, #1f5493)' : 'var(--bui-border-1, #d5d5d5)'}`,
                background: isSelected ? 'var(--contribfest-progress-bg, #dcfce7)' : 'var(--bui-bg-popover, #fff)',
                color: 'var(--bui-fg-primary, #000)',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
