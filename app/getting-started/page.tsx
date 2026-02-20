'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChecklistItem } from '@/components/ChecklistItem';
import { Celebration } from '@/components/Celebration';
import type { ChecklistItem as ChecklistItemType } from '@/lib/types';
import { WelcomeCard } from '@/components/WelcomeCard';
import type { ResourceCard } from '@/lib/types';

type DevEnvironment = 'native' | 'devcontainer';

const forkItems: ChecklistItemType[] = [
  {
    id: 'fork-backstage',
    label: 'Fork and Clone the Backstage Repository',
    description:
      'Follow these steps to get the Backstage repo ready for contributing.',
    icon: 'git-fork',
    completed: false,
    children: [
      {
        id: 'fork-backstage-fork',
        label: 'Fork Backstage Repository',
        description:
          'The link will bring you to a GitHub page that simplifies the process of creating a fork. All you need to do is pick the Owner from the drop down, in this case that will be your GitHub username. Then hit the Create fork button!',
        link: 'https://github.com/backstage/backstage/fork',
        icon: 'git-fork',
        completed: false,
      },
      {
        id: 'fork-backstage-clone',
        label: 'Clone your Backstage fork',
        description:
          '`git clone --filter=tree:0 https://github.com/{your-github-username}/backstage`\nMake sure to update the command with your GitHub username!',
        icon: 'download',
        completed: false,
      },
    ],
  },
  {
    id: 'fork-plugins',
    label: 'Fork and Clone the Community Plugins Repository',
    description:
      'Follow these steps to get the Community Plugins repo ready for contributing.',
    icon: 'git-fork',
    completed: false,
    children: [
      {
        id: 'fork-plugins-fork',
        label: 'Fork Community Plugins Repository',
        description:
          'The link will bring you to a GitHub page that simplifies the process of creating a fork. All you need to do is pick the Owner from the drop down, in this case that will be your GitHub username. Then hit the Create fork button!',
        link: 'https://github.com/backstage/community-plugins/fork',
        icon: 'git-fork',
        completed: false,
      },
      {
        id: 'fork-plugins-clone',
        label: 'Clone your Community Plugins fork',
        description:
          '`git clone --filter=tree:0 https://github.com/{your-github-username}/community-plugins`\nMake sure to update the command with your GitHub username!',
        icon: 'download',
        completed: false,
      },
    ],
  },
];

const forkItemIds = new Set(['fork-backstage', 'fork-plugins']);

const sidebarResources: ResourceCard[] = [
  {
    title: 'Introduction to Plugins',
    description: 'Learn more about plugin development in Backstage.',
    url: 'https://backstage.io/docs/plugins/',
    isExternal: true,
  },
  {
    title: 'New Frontend System Plugin Migration Guide',
    description:
      'A helpful guide for migrating plugins to the New Frontend System.',
    url: 'https://backstage.io/docs/frontend-system/building-plugins/migrating',
    isExternal: true,
  },
  {
    title: 'Backstage UI (BUI) Documentation',
    description:
      'The documentation for all the available Backstage UI (BUI) components and how to use them.',
    url: 'https://ui.backstage.io/',
    isExternal: true,
  },
  {
    title: 'Backend System',
    description: 'Details about the Backend System used by Backstage.',
    url: 'https://backstage.io/docs/backend-system/',
    isExternal: true,
  },
];

const nativeChecklist: ChecklistItemType[] = [
  {
    id: 'system-requirements',
    label: 'System Requirements',
    description: '20GB of free disk space and 6GB of memory',
    icon: 'hard-drive',
    completed: false,
  },
  {
    id: 'os-requirements',
    label: 'Operating System Requirements',
    description:
      'Access to a Unix-based operating system, such as Linux, macOS or Windows Subsystem for Linux (WSL). The Linux version must support the required Node.js version.',
    icon: 'terminal',
    completed: false,
  },
  {
    id: 'tooling-requirements',
    label: 'Tooling Requirements',
    description:
      "The following tools need to be installed, these won't be covered in detail as they are very likely already installed and setup.",
    icon: 'tools',
    completed: false,
    children: [
      {
        id: 'tooling-build-environment',
        label: 'Build Environment',
        description:
          'A GNU-like build environment available at the command line. For example, on Debian/Ubuntu you will want to have the make and build-essential packages installed. On macOS, you will want to run `xcode-select --install` to get the XCode command line build tooling in place.',
        icon: 'hammer',
        completed: false,
      },
      {
        id: 'tooling-curl-wget',
        label: 'curl or wget installed',
        description: 'These are used to install tooling in further steps.',
        icon: 'download',
        completed: false,
      },
      {
        id: 'tooling-git',
        label: 'git installed',
        description:
          'git is used throughout the session and is the key method for contributing your changes.',
        icon: 'git-repo',
        completed: false,
      },
      {
        id: 'tooling-text-editor',
        label: 'Text editor',
        description:
          'This can be VSCode, Cursor, vim, emacs or whatever your preferred editor might be!',
        icon: 'edit',
        completed: false,
      },
    ],
  },
  {
    id: 'nodejs',
    label: 'Install Node.js',
    description:
      "Follow these steps to get Node installed on the version you'll need for ContribFest.",
    icon: 'nodejs',
    completed: false,
    children: [
      {
        id: 'nodejs-version-check',
        label: 'Node version check',
        description:
          '`node --version`\nThis command should output v22.x.x, if you get an error like command not found you need to install Node, if you see a different version then you need to install the correct version.',
        icon: 'check',
        completed: false,
      },
      {
        id: 'nodejs-nvm',
        label: 'Install nvm',
        description:
          '`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`',
        link: 'https://github.com/nvm-sh/nvm#installing-and-updating',
        icon: 'download',
        completed: false,
      },
      {
        id: 'nodejs-22',
        label: 'Use nvm to install Node 22',
        description: '`nvm install lts/jod`',
        icon: 'terminal-cmd',
        completed: false,
      },
      {
        id: 'nodejs-default',
        label: 'Set the default Node version for nvm',
        description: '`nvm alias default lts/jod`',
        icon: 'terminal-cmd',
        completed: false,
      },
    ],
  },
  {
    id: 'yarn',
    label: 'Install Yarn',
    description:
      'Follow these steps to install Yarn, this is the package manager Backstage and Community Plugins uses.',
    icon: 'code',
    completed: false,
    children: [
      {
        id: 'yarn-version-check',
        label: 'Yarn version check',
        description:
          "`yarn -v`\nThis command should output 4.x.x, if you get an error like command not found you need to install Yarn, if you don't see version 4 then you need to install the correct version.",
        icon: 'check',
        completed: false,
      },
      {
        id: 'yarn-install-corepack',
        label: 'Install Yarn using corepack',
        description: '`corepack enable`',
        icon: 'terminal-cmd',
        completed: false,
      },
    ],
  },
  ...forkItems,
];

const devcontainerChecklist: ChecklistItemType[] = [
  {
    id: 'dc-system-requirements',
    label: 'System Requirements',
    description:
      'At least 2 CPU cores, 4GB of RAM, and 32GB of free disk space.',
    icon: 'computer',
    completed: false,
  },
  {
    id: 'dc-os-requirements',
    label: 'Operating System Requirements',
    description:
      'A Docker-compatible operating system: Linux, macOS, or Windows (with WSL 2 enabled).',
    icon: 'terminal',
    completed: false,
  },
  {
    id: 'dc-tooling-requirements',
    label: 'Tooling Requirements',
    description:
      'The following tools need to be installed to use Dev Containers.',
    icon: 'tools',
    completed: false,
    children: [
      {
        id: 'dc-tooling-docker',
        label: 'Docker Desktop (or Docker Engine on Linux)',
        description:
          'Install Docker Desktop for Mac or Windows, or Docker Engine for Linux.',
        link: 'https://docs.docker.com/get-docker/',
        icon: 'ship',
        completed: false,
      },
      {
        id: 'dc-tooling-editor',
        label:
          'VS Code with Dev Containers extension or IntelliJ IDEA Ultimate',
        description:
          'Install VS Code and the Dev Containers extension from the Marketplace, or use IntelliJ IDEA Ultimate which has built-in support.',
        link: 'https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers',
        icon: 'edit',
        completed: false,
      },
      {
        id: 'dc-tooling-git',
        label: 'git installed',
        description:
          'git is used to clone the repository and contribute your changes.',
        icon: 'git-repo',
        completed: false,
      },
      {
        id: 'dc-tooling-docs',
        label: 'Read the Dev Containers documentation',
        description:
          'Learn how Dev Containers work and how to use them effectively for backstage development.',
        link: 'https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/devcontainer.md',
        icon: 'book',
        completed: false,
      },
    ],
  },
  ...forkItems,
];

export default function GettingStartedPage() {
  const [devEnv, setDevEnv] = useLocalStorage<DevEnvironment>(
    'contribfest-dev-environment',
    'native',
  );
  const [nativeState, setNativeState] = useLocalStorage<ChecklistItemType[]>(
    'contribfest-checklist-native',
    nativeChecklist,
  );
  const [dcState, setDcState] = useLocalStorage<ChecklistItemType[]>(
    'contribfest-checklist-devcontainer',
    devcontainerChecklist,
  );

  const checklist = devEnv === 'devcontainer' ? dcState : nativeState;
  const setChecklist = devEnv === 'devcontainer' ? setDcState : setNativeState;

  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contribfest-celebration-shown') === 'true';
    }
    return false;
  });

  const handleToggle = (id: string) => {
    setChecklist((prevChecklist) => {
      const toggleItem = (items: ChecklistItemType[]): ChecklistItemType[] => {
        return items.map((item) => {
          // If this is the item being toggled
          if (item.id === id) {
            const newCompleted = !item.completed;
            // If it has children, toggle all children to match parent
            if (item.children && item.children.length > 0) {
              return {
                ...item,
                completed: newCompleted,
                children: item.children.map((child) => ({
                  ...child,
                  completed: newCompleted,
                })),
              };
            }
            return { ...item, completed: newCompleted };
          }

          // If this item has children, check if any child was toggled
          if (item.children && item.children.length > 0) {
            const updatedChildren = toggleItem(item.children);
            const allChildrenCompleted = updatedChildren.every(
              (child) => child.completed,
            );

            return {
              ...item,
              children: updatedChildren,
              completed: allChildrenCompleted,
            };
          }

          return item;
        });
      };

      return toggleItem(prevChecklist);
    });
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all checkboxes? This will clear all your progress.',
      )
    ) {
      window.localStorage.removeItem('contribfest-checklist-native');
      window.localStorage.removeItem('contribfest-checklist-devcontainer');
      window.localStorage.removeItem('contribfest-celebration-shown');
      setNativeState(nativeChecklist);
      setDcState(devcontainerChecklist);
      setHasShownCelebration(false);
      setDevEnv('native');
    }
  };

  // Progress: non-fork items count individually, fork items count as 1 if either is done
  const nonForkItems = checklist.filter((item) => !forkItemIds.has(item.id));
  const forkItemsInList = checklist.filter((item) => forkItemIds.has(item.id));
  const completedNonFork = nonForkItems.filter((item) => item.completed).length;
  const anyForkCompleted = forkItemsInList.some((item) => item.completed);

  const completedCount = completedNonFork + (anyForkCompleted ? 1 : 0);
  const totalCount = nonForkItems.length + (forkItemsInList.length > 0 ? 1 : 0);
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Celebration: all non-fork items done AND at least one fork item done
  useEffect(() => {
    const allNonForkDone = nonForkItems.every((item) => item.completed);
    const ready = allNonForkDone && anyForkCompleted && totalCount > 0;
    if (ready && !hasShownCelebration) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowCelebration(true);
      setHasShownCelebration(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('contribfest-celebration-shown', 'true');
      }
    }
  }, [
    checklist,
    nonForkItems,
    totalCount,
    hasShownCelebration,
    anyForkCompleted,
  ]);

  return (
    <div
      style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}
      className="getting-started-layout"
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {showCelebration && (
          <Celebration onClose={() => setShowCelebration(false)} />
        )}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            🚀 Getting Started
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}
          >
            Complete these steps to set up your development environment for
            contributing to Backstage.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '16px',
                background: 'var(--contribfest-progress-bg, #dcfce7)',
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
                e.currentTarget.style.background =
                  'var(--contribfest-progress-bg, #dcfce7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bui-bg-app, #f8f8f8)';
              }}
            >
              Reset
            </button>
          </div>

          {/* Development environment selection */}
          <div
            style={{
              padding: '16px',
              background: 'var(--bui-bg-app, #f8f8f8)',
              border: '1px solid var(--bui-border-1, #d5d5d5)',
              borderRadius: '8px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--bui-fg-primary, #000)',
                marginBottom: '4px',
              }}
            >
              How will you develop?
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--bui-fg-secondary, #666)',
                lineHeight: '1.5',
                marginBottom: '12px',
              }}
            >
              Choose <strong>Native stack</strong> if you want to install
              Node.js, Yarn, and other tools directly on your machine. Choose{' '}
              <strong>Dev Containers</strong> if you prefer a Docker-based
              environment where all dependencies are provided automatically —
              you only need Docker and a supported editor.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  color: 'var(--bui-fg-primary, #000)',
                }}
              >
                <input
                  type="radio"
                  name="dev-environment"
                  value="native"
                  checked={devEnv === 'native'}
                  onChange={() => setDevEnv('native')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Native stack
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  color: 'var(--bui-fg-primary, #000)',
                }}
              >
                <input
                  type="radio"
                  name="dev-environment"
                  value="devcontainer"
                  checked={devEnv === 'devcontainer'}
                  onChange={() => setDevEnv('devcontainer')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Dev Containers
              </label>
            </div>
          </div>
        </div>

        <div>
          {checklist.map((item) => (
            <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
          ))}
        </div>
      </div>

      <aside
        style={{ width: '280px', flexShrink: 0 }}
        className="getting-started-sidebar"
      >
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '16px',
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Post Setup Resources
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sidebarResources.map((resource, index) => (
            <WelcomeCard key={index} {...resource} />
          ))}
        </div>
      </aside>
    </div>
  );
}
