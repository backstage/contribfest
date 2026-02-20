# Hall of Hosts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Hall of Hosts" page celebrating ContribFest session hosts, with profile cards and a "Past ContribFest Sessions" sidebar.

**Architecture:** New static page at `/hall-of-hosts/` using a `Host` type in `lib/types.ts`, data in `lib/hosts.ts`, a new `HostCard` component, and the existing `SessionsSidebar` reused as-is. Layout mirrors the ContribChamps two-column pattern.

**Tech Stack:** Next.js 16 App Router (static export), React 19, TypeScript, inline styles with CSS variables, no Tailwind.

---

## Task 1: Add `Host` type to `lib/types.ts`

**Files:**
- Modify: `lib/types.ts`

**Step 1: Add the type at the bottom of the file**

Open `lib/types.ts` and append after the last interface (after `ContribFestSession`):

```typescript
// Hall of Hosts — individual host record
export interface Host {
  name: string
  title: string
  company: string
  kubecon: string    // e.g. "KubeCon NA 2024 – Salt Lake City"
  imagePath: string  // e.g. "/img/hosts/jane-doe.jpg"
}
```

**Step 2: Verify TypeScript compiles**

```bash
yarn build 2>&1 | head -30
```

Expected: No new type errors.

**Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add Host type for Hall of Hosts page"
```

---

## Task 2: Create `lib/hosts.ts` with placeholder data

**Files:**
- Create: `lib/hosts.ts`

**Step 1: Create the file**

```typescript
import type { Host } from './types'

export const hosts: Host[] = [
  // Data will be populated by the user
  // Example shape:
  // {
  //   name: 'Jane Doe',
  //   title: 'Senior Engineer',
  //   company: 'Acme Corp',
  //   kubecon: 'KubeCon NA 2024 – Salt Lake City',
  //   imagePath: '/img/hosts/jane-doe.jpg',
  // },
]
```

**Step 2: Verify TypeScript compiles**

```bash
yarn build 2>&1 | head -30
```

Expected: No errors.

**Step 3: Commit**

```bash
git add lib/hosts.ts
git commit -m "feat: add hosts data file"
```

---

## Task 3: Create the `public/img/hosts/` directory

**Files:**
- Create: `public/img/hosts/.gitkeep`

**Step 1: Create the directory with a gitkeep**

```bash
mkdir -p public/img/hosts
touch public/img/hosts/.gitkeep
```

**Step 2: Commit**

```bash
git add public/img/hosts/.gitkeep
git commit -m "chore: add public/img/hosts directory for host profile images"
```

---

## Task 4: Create `HostCard` component

**Files:**
- Create: `components/HostCard.tsx`

**Step 1: Create the component**

```tsx
import type { Host } from '@/lib/types'

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  return (
    <div
      style={{
        background: 'var(--bui-bg-popover, #fff)',
        border: '1px solid var(--bui-border-1, #d5d5d5)',
        borderRadius: '8px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-bg-solid, #268271)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--bui-border-1, #d5d5d5)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Profile image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={host.imagePath}
        alt={host.name}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '16px',
          border: '2px solid var(--bui-border-1, #d5d5d5)',
        }}
      />

      {/* Name */}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 4px 0',
          color: 'var(--bui-fg-primary, #000)',
        }}
      >
        {host.name}
      </h3>

      {/* Title */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--bui-fg-secondary, #666)',
          margin: '0 0 2px 0',
        }}
      >
        {host.title}
      </p>

      {/* Company */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--bui-fg-secondary, #666)',
          margin: '0 0 16px 0',
        }}
      >
        {host.company}
      </p>

      {/* KubeCon badge */}
      <div
        style={{
          display: 'inline-block',
          background: 'var(--bui-bg-solid, #268271)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '4px 10px',
          borderRadius: '4px',
          marginTop: 'auto',
        }}
      >
        {host.kubecon}
      </div>
    </div>
  )
}
```

**Step 2: Verify TypeScript compiles**

```bash
yarn build 2>&1 | head -30
```

Expected: No errors.

**Step 3: Commit**

```bash
git add components/HostCard.tsx
git commit -m "feat: add HostCard component"
```

---

## Task 5: Create `app/hall-of-hosts/page.tsx`

**Files:**
- Create: `app/hall-of-hosts/page.tsx`

This reuses the `contrib-champs-layout` CSS class and the `SessionsSidebar` component exactly as used in `app/contrib-champs/page.tsx`. The sessions array is copied from that page.

**Step 1: Create the page**

```tsx
import { HostCard } from '@/components/HostCard'
import { SessionsSidebar } from '@/components/SessionsSidebar'
import { hosts } from '@/lib/hosts'
import type { ContribFestSession } from '@/lib/types'

const sessions: ContribFestSession[] = [
  {
    location: 'Amsterdam',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'March 2026',
    blogUrl: 'https://kccnceu2026.sched.com/event/2EF7v/contribfest-supercharge-your-open-source-impact-backstage-contribfest-live-andre-wanlin-emma-indal-spotify-heikki-hellgren-op-financial-group-elaine-bezerra-db-systel-gmbh?iframe=no',
    comingSoon: true,
    linkText: 'Add to Schedule',
  },
  {
    location: 'Atlanta',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2025',
    blogUrl: 'https://backstage.io/blog/2025/11/25/backstagecon-kubecon-25-atlanta/#our-third-backstage-contribfest',
  },
  {
    location: 'London',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'April 2025',
    blogUrl: 'https://backstage.io/blog/2025/04/29/backstagecon-kubecon-25-london/#backstage-contribfest-goes-across-the-pond',
  },
  {
    location: 'Salt Lake City',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2024',
    blogUrl: 'https://backstage.io/blog/2024/12/09/kubecon-slc-24/#contribfest-its-all-about-community',
  },
]

export default function HallOfHostsPage() {
  return (
    <div className="contrib-champs-layout">
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Page header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            🙏 Hall of Hosts
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Meet the people who made ContribFest happen. These hosts organized and facilitated
            Backstage ContribFest sessions at KubeCon events around the world.
          </p>
        </div>

        {/* Host cards grid */}
        {hosts.length === 0 ? (
          <div
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              background: 'var(--bui-bg-app, #f5f6f7)',
              borderRadius: '8px',
              color: 'var(--bui-fg-secondary, #666)',
              fontSize: '16px',
            }}
          >
            Host profiles coming soon!
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {hosts.map((host) => (
              <HostCard key={host.name} host={host} />
            ))}
          </div>
        )}
      </div>

      {/* Sessions sidebar */}
      <SessionsSidebar sessions={sessions} />
    </div>
  )
}
```

**Step 2: Verify TypeScript compiles**

```bash
yarn build 2>&1 | head -30
```

Expected: No errors.

**Step 3: Verify in browser**

Navigate to `http://localhost:3000/hall-of-hosts/`

Expected:
- Page renders with "🙏 Hall of Hosts" heading
- Description text is visible
- "Host profiles coming soon!" placeholder message shows (since `hosts` array is empty)
- "Past ContribFest Sessions" sidebar appears on the right
- On mobile (resize to < 768px): sidebar moves below the main content

**Step 4: Commit**

```bash
git add app/hall-of-hosts/page.tsx
git commit -m "feat: add Hall of Hosts page"
```

---

## Task 6: Add Hall of Hosts to the sidebar

**Files:**
- Modify: `components/Sidebar.tsx:9-14`

**Step 1: Add the nav entry**

In `components/Sidebar.tsx`, find the `navigationLinks` array (lines 9-14) and add the Hall of Hosts entry at the bottom:

```typescript
const navigationLinks = [
  { href: '/', label: 'Welcome', emoji: '👋', image: 'waving_drk.png' },
  { href: '/getting-started/', label: 'Getting Started', emoji: '🚀', image: 'walking_drk.png' },
  { href: '/issues/', label: 'Curated Issues', emoji: '🔍', image: 'looking_drk.png' },
  { href: '/contrib-champs/', label: 'Contrib Champs', emoji: '🏆', image: 'love_backstage_drk.png' },
  { href: '/hall-of-hosts/', label: 'Hall of Hosts', emoji: '🙏', image: 'waving_drk.png' },
]
```

Note: `image: 'waving_drk.png'` reuses the waving Bowie image as a fallback (same as Welcome page) since there is no dedicated Bowie variant for this page yet.

**Step 2: Verify TypeScript compiles**

```bash
yarn build 2>&1 | head -30
```

Expected: No errors.

**Step 3: Verify in browser**

- "🙏 Hall of Hosts" appears at the bottom of the sidebar nav
- Clicking it navigates to `/hall-of-hosts/`
- Active state (green background, teal text, bold) shows when on the page
- On mobile: sidebar closes after clicking the link

**Step 4: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: add Hall of Hosts to sidebar navigation"
```

---

## Done

All tasks complete. The Hall of Hosts page is live at `/hall-of-hosts/`. When the user provides host data, populate `lib/hosts.ts` and add profile images to `public/img/hosts/`.
