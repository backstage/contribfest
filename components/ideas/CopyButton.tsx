'use client'

import { useState } from 'react'
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'

interface CopyButtonProps {
  text: string
  label?: string
  disabled?: boolean
}

export function CopyButton({ text, label = 'Copy', disabled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '4px',
        background: 'var(--bui-bg-popover, #fff)',
        color: 'var(--bui-fg-primary, #000)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {copied ? <RiCheckLine size={14} aria-hidden="true" /> : <RiFileCopyLine size={14} aria-hidden="true" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}
