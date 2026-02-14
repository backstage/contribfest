'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ChecklistItem } from '@/components/ChecklistItem'
import { Celebration } from '@/components/Celebration'
import type { ChecklistItem as ChecklistItemType } from '@/lib/types'

const initialChecklist: ChecklistItemType[] = [
  {
    id: 'system-requirements',
    label: 'System Requirements',
    description: '20GB of free disk space and 6GB of memory',
    completed: false,
  },
  {
    id: 'os-requirements',
    label: 'Operating System Requirements',
    description: 'Access to a Unix-based operating system, such as Linux, macOS or Windows Subsystem for Linux (WSL). The Linux version must support the required Node.js version.',
    completed: false,
  },
  {
    id: 'tooling-requirements',
    label: 'Tooling Requirements',
    description: 'The following tools need to be installed, these won\'t be covered in detail as they are very likely already installed and setup.',
    completed: false,
    children: [
      {
        id: 'tooling-build-environment',
        label: 'Build Environment',
        description: 'A GNU-like build environment available at the command line. For example, on Debian/Ubuntu you will want to have the make and build-essential packages installed. On macOS, you will want to run `xcode-select --install` to get the XCode command line build tooling in place.',
        completed: false,
      },
      {
        id: 'tooling-curl-wget',
        label: 'curl or wget installed',
        description: 'These are used to install tooling in further steps.',
        completed: false,
      },
      {
        id: 'tooling-git',
        label: 'git installed',
        description: 'git is used throughout the session and is the key method for contributing your changes.',
        completed: false,
      },
      {
        id: 'tooling-text-editor',
        label: 'Text editor',
        description: 'This can be VSCode, Cursor, vim, emacs or whatever your preferred editor might be!',
        completed: false,
      },
    ],
  },
  {
    id: 'nodejs',
    label: 'Install Node.js',
    description: 'Follow these steps to get Node installed on the version you\'ll need for ContribFest.',
    completed: false,
    children: [
      {
        id: 'nodejs-version-check',
        label: 'Node version check',
        description: '`node --version`\nThis command should output v22.x.x, if you get an error like command not found you need to install Node, if you see a different version then you need to install the correct version.',
        completed: false,
      },
      {
        id: 'nodejs-nvm',
        label: 'Install nvm',
        description: '`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`',
        link: 'https://github.com/nvm-sh/nvm#installing-and-updating',
        completed: false,
      },
      {
        id: 'nodejs-22',
        label: 'Use nvm to install Node 22',
        description: '`nvm install lts/jod`',
        completed: false,
      },
      {
        id: 'nodejs-default',
        label: 'Set the default Node version for nvm',
        description: '`nvm alias default lts/jod`',
        completed: false,
      },
    ],
  },
  {
    id: 'yarn',
    label: 'Install Yarn',
    description: 'Follow these steps to install Yarn, this is the package manager Backstage and Community Plugins uses.',
    completed: false,
    children: [
      {
        id: 'yarn-version-check',
        label: 'Yarn version check',
        description: '`yarn -v`\nThis command should output 4.x.x, if you get an error like command not found you need to install Yarn, if you don\'t see version 4 then you need to install the correct version.',
        completed: false,
      },
      {
        id: 'yarn-install-corepack',
        label: 'Install Yarn using corepack',
        description: '`corepack enable`',
        completed: false,
      },
    ],
  },
  {
    id: 'fork-backstage',
    label: 'Fork and Clone the Backstage Repository',
    description: 'Follow these steps to get the Backstage repo ready for contributing.',
    completed: false,
    children: [
      {
        id: 'fork-backstage-fork',
        label: 'Fork Backstage Repository',
        description: 'The link will bring you to a GitHub page that simplifies the process of creating a fork. All you need to do is pick the Owner from the drop down, in this case that will be your GitHub username. Then hit the Create fork button!',
        link: 'https://github.com/backstage/backstage/fork',
        completed: false,
      },
      {
        id: 'fork-backstage-clone',
        label: 'Clone your Backstage fork',
        description: '`git clone --filter=tree:0 https://github.com/{your-github-username}/backstage`\nMake sure to update the command with your GitHub username!',
        completed: false,
      },
    ],
  },
  {
    id: 'fork-plugins',
    label: 'Fork and Clone the Community Plugins Repository',
    completed: false,
    children: [
      {
        id: 'fork-plugins-fork',
        label: 'Fork Community Plugins Repository',
        description: 'The link will bring you to a GitHub page that simplifies the process of creating a fork. All you need to do is pick the Owner from the drop down, in this case that will be your GitHub username. Then hit the Create fork button!',
        link: 'https://github.com/backstage/community-plugins/fork',
        completed: false,
      },
      {
        id: 'fork-plugins-clone',
        label: 'Clone your Community Plugins fork',
        description: '`git clone --filter=tree:0 https://github.com/{your-github-username}/community-plugins`\nMake sure to update the command with your GitHub username!',
        completed: false,
      },
    ],
  },
]

export default function GettingStartedPage() {
  const [checklist, setChecklist] = useLocalStorage<ChecklistItemType[]>(
    'contribfest-checklist',
    initialChecklist
  )
  const [showCelebration, setShowCelebration] = useState(false)
  const [hasShownCelebration, setHasShownCelebration] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contribfest-celebration-shown') === 'true'
    }
    return false
  })

  const handleToggle = (id: string) => {
    setChecklist((prevChecklist) => {
      const toggleItem = (items: ChecklistItemType[]): ChecklistItemType[] => {
        return items.map((item) => {
          // If this is the item being toggled
          if (item.id === id) {
            const newCompleted = !item.completed
            // If it has children, toggle all children to match parent
            if (item.children && item.children.length > 0) {
              return {
                ...item,
                completed: newCompleted,
                children: item.children.map((child) => ({
                  ...child,
                  completed: newCompleted,
                })),
              }
            }
            return { ...item, completed: newCompleted }
          }

          // If this item has children, check if any child was toggled
          if (item.children && item.children.length > 0) {
            const updatedChildren = toggleItem(item.children)
            const allChildrenCompleted = updatedChildren.every((child) => child.completed)

            return {
              ...item,
              children: updatedChildren,
              completed: allChildrenCompleted,
            }
          }

          return item
        })
      }

      return toggleItem(prevChecklist)
    })
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all checkboxes? This will clear all your progress.')) {
      // Clear local storage and reset to initial state
      window.localStorage.removeItem('contribfest-checklist')
      window.localStorage.removeItem('contribfest-celebration-shown')
      setChecklist(initialChecklist)
      setHasShownCelebration(false)
    }
  }

  // Count only parent items (not sub-items)
  const completedCount = checklist.filter((item) => item.completed).length
  const totalCount = checklist.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Check if all items are completed and show celebration
  useEffect(() => {
    const allCompleted = checklist.every((item) => item.completed)
    if (allCompleted && totalCount > 0 && !hasShownCelebration) {
      setShowCelebration(true)
      setHasShownCelebration(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('contribfest-celebration-shown', 'true')
      }
    }
  }, [checklist, totalCount, hasShownCelebration])

  return (
    <div>
      {showCelebration && <Celebration onClose={() => setShowCelebration(false)} />}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Getting Started
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--bui-fg-secondary, #666)',
            lineHeight: '1.6',
            marginBottom: '16px',
          }}
        >
          Complete these steps to set up your development environment for contributing to
          Backstage.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '16px',
              background: 'var(--bui-bg-info, #dbeafe)',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            Progress: {completedCount} / {totalCount} ({percentage}%)
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              background: 'var(--bui-bg-app, #f8f8f8)',
              border: '1px solid var(--bui-border-1, #d5d5d5)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--bui-fg-primary, #000)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bui-bg-info, #dbeafe)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bui-bg-app, #f8f8f8)'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '600px' }}>
        {checklist.map((item) => (
          <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  )
}
