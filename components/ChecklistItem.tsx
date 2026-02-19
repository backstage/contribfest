'use client'

import { useState } from 'react'
import type { ChecklistItem as ChecklistItemType } from '@/lib/types'
import {
  RiExternalLinkLine,
  RiFileCopyLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiComputerLine,
  RiTerminalBoxLine,
  RiToolsLine,
  RiNodejsLine,
  RiGitForkLine,
  RiGitRepositoryLine,
  RiDownloadLine,
  RiEdit2Line,
  RiHammerLine,
  RiBookOpenLine,
  RiTerminalLine,
  RiCheckboxCircleLine,
  RiShipLine,
  RiCodeSSlashLine,
  RiHardDriveLine,
} from '@remixicon/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  computer: RiComputerLine,
  terminal: RiTerminalBoxLine,
  tools: RiToolsLine,
  nodejs: RiNodejsLine,
  'git-fork': RiGitForkLine,
  'git-repo': RiGitRepositoryLine,
  download: RiDownloadLine,
  edit: RiEdit2Line,
  hammer: RiHammerLine,
  book: RiBookOpenLine,
  'terminal-cmd': RiTerminalLine,
  check: RiCheckboxCircleLine,
  ship: RiShipLine,
  code: RiCodeSSlashLine,
  'hard-drive': RiHardDriveLine,
}

interface ChecklistItemProps {
  item: ChecklistItemType
  onToggle: (id: string) => void
  isChild?: boolean
}

// Parse description text and render code blocks in backticks
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--bui-bg-code, rgba(110, 118, 129, 0.1))',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        padding: '4px 8px',
        borderRadius: '6px',
      }}
    >
      <code
        style={{
          fontFamily: 'monospace',
          fontSize: '13px',
          color: 'var(--bui-fg-primary, #1f2937)',
          fontWeight: 500,
        }}
      >
        {code}
      </code>
      <button
        onClick={handleCopy}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          color: copied ? 'var(--bui-fg-success, #22c55e)' : 'var(--bui-fg-secondary, #666)',
        }}
        aria-label="Copy to clipboard"
      >
        {copied ? <RiCheckLine size={14} /> : <RiFileCopyLine size={14} />}
      </button>
    </div>
  )
}

function renderDescription(text: string) {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1)
      return <CodeBlock key={index} code={code} />
    }
    // Handle newlines
    if (part.includes('\n')) {
      return part.split('\n').map((line, i) => (
        <span key={`${index}-${i}`}>
          {i > 0 && <br />}
          {line}
        </span>
      ))
    }
    return <span key={index}>{part}</span>
  })
}

export function ChecklistItem({ item, onToggle, isChild = false }: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    onToggle(item.id)
  }

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  // If this item has children and is not itself a child, use accordion style
  if (item.children && item.children.length > 0 && !isChild) {
    return (
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            border: '1px solid var(--bui-border-1, #d5d5d5)',
            borderRadius: '8px',
            background: 'var(--bui-bg-app, #f8f8f8)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              borderBottom: isExpanded ? '1px solid var(--bui-border-1, #d5d5d5)' : 'none',
            }}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => {}}
              onClick={handleClick}
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                marginTop: '2px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label={`Mark "${item.label}" as complete`}
            />
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={toggleExpanded}
            >
              <div>
                <span
                  style={{
                    fontSize: '16px',
                    color: 'var(--bui-fg-primary, #000)',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    fontWeight: item.completed ? 400 : 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {item.icon && iconMap[item.icon] && (() => {
                    const Icon = iconMap[item.icon!]
                    return (
                      <Icon
                        size={20}
                        style={{
                          flexShrink: 0,
                          color: 'var(--bui-fg-secondary, #666)',
                        }}
                      />
                    )
                  })()}
                  {item.label}
                </span>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      marginLeft: '8px',
                      fontSize: '14px',
                      color: 'var(--bui-bg-solid, #1f5493)',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <RiExternalLinkLine size={16} />
                  </a>
                )}
              </div>
              {item.description && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    color: 'var(--bui-fg-secondary, #666)',
                    lineHeight: '1.5',
                  }}
                >
                  {renderDescription(item.description)}
                </div>
              )}
            </div>
            <button
              onClick={toggleExpanded}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--bui-fg-secondary, #666)',
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <RiArrowDownSLine size={20} />
            </button>
          </div>
          {isExpanded && (
            <div
              onClick={handleChildClick}
              style={{
                paddingBottom: '8px',
                background: 'var(--bui-bg-app, #f8f8f8)',
              }}
            >
              {item.children.map((child) => (
                <ChecklistItem key={child.id} item={child} onToggle={onToggle} isChild={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Regular item (no children or is a child itself)
  return (
    <div
      style={{
        border: isChild ? 'none' : '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: isChild ? '0' : '8px',
        background: isChild ? 'transparent' : 'var(--bui-bg-app, #f8f8f8)',
        marginBottom: isChild ? '0' : '12px',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '16px',
          paddingLeft: isChild ? '48px' : '16px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: isChild ? 'transparent' : 'inherit',
        }}
        onMouseEnter={(e) => {
          if (!isChild) {
            e.currentTarget.style.background = 'var(--bui-bg-info, #dbeafe)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isChild) {
            e.currentTarget.style.background = 'var(--bui-bg-app, #f8f8f8)'
          }
        }}
      >
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => {}} // Controlled by parent click
          style={{
            width: '20px',
            height: '20px',
            marginRight: '12px',
            marginTop: '2px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label={`Mark "${item.label}" as complete`}
        />
        <div style={{ flex: 1 }}>
          <div>
            <span
              style={{
                fontSize: isChild ? '15px' : '16px',
                color: 'var(--bui-fg-primary, #000)',
                textDecoration: item.completed ? 'line-through' : 'none',
                fontWeight: item.completed ? 400 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {item.icon && iconMap[item.icon] && (() => {
                const Icon = iconMap[item.icon!]
                return (
                  <Icon
                    size={18}
                    style={{
                      flexShrink: 0,
                      color: 'var(--bui-fg-secondary, #666)',
                    }}
                  />
                )
              })()}
              {item.label}
            </span>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  marginLeft: '8px',
                  fontSize: '14px',
                  color: 'var(--bui-bg-solid, #1f5493)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <RiExternalLinkLine size={16} />
              </a>
            )}
          </div>
          {item.description && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '14px',
                color: 'var(--bui-fg-secondary, #666)',
                lineHeight: '1.5',
              }}
            >
              {renderDescription(item.description)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
