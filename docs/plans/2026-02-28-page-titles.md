# Page Titles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add unique browser tab titles to every page using Next.js App Router metadata.

**Architecture:** Root layout uses a title template (`%s | Backstage ContribFest`). Server component pages export `metadata` directly. Client component pages get a sibling `layout.tsx` to hold their `metadata` export (since `'use client'` files cannot export metadata in Next.js App Router).

**Tech Stack:** Next.js 14+ App Router, TypeScript

---

### Task 1: Update root layout to use title template

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update the metadata export**

Replace the current `title` string with an object:

```ts
export const metadata = {
  title: {
    default: 'Backstage ContribFest',
    template: '%s | Backstage ContribFest',
  },
  description: 'Backstage ContribFest Resources',
  icons: {
    icon: `/favicon.ico`,
  },
}
```

**Step 2: Verify the dev server still compiles**

Run: `yarn dev`
Expected: Server starts without errors, home page title is still `Backstage ContribFest`

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add title template to root layout"
```

---

### Task 2: Add metadata to server component pages

**Files:**
- Modify: `app/hall-of-hosts/page.tsx`
- Note: `app/page.tsx` (home) intentionally gets no metadata — the root `default` title applies

**Step 1: Add metadata export to `app/hall-of-hosts/page.tsx`**

Add this before the `export default function` line:

```ts
export const metadata = {
  title: 'Hall of Hosts',
}
```

**Step 2: Verify in browser**

Navigate to `/hall-of-hosts` and confirm the tab reads `Hall of Hosts | Backstage ContribFest`.

**Step 3: Commit**

```bash
git add app/hall-of-hosts/page.tsx
git commit -m "feat: add page title to Hall of Hosts"
```

---

### Task 3: Add metadata layout for Getting Started

**Files:**
- Create: `app/getting-started/layout.tsx`

**Step 1: Create the layout file**

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting Started',
}

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

**Step 2: Verify in browser**

Navigate to `/getting-started` and confirm the tab reads `Getting Started | Backstage ContribFest`.

**Step 3: Commit**

```bash
git add app/getting-started/layout.tsx
git commit -m "feat: add page title to Getting Started"
```

---

### Task 4: Add metadata layout for Issues

**Files:**
- Create: `app/issues/layout.tsx`

**Step 1: Create the layout file**

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Curated Issues',
}

export default function IssuesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

**Step 2: Verify in browser**

Navigate to `/issues` and confirm the tab reads `Curated Issues | Backstage ContribFest`.

**Step 3: Commit**

```bash
git add app/issues/layout.tsx
git commit -m "feat: add page title to Curated Issues"
```

---

### Task 5: Add metadata layout for Contrib Champs

**Files:**
- Create: `app/contrib-champs/layout.tsx`

**Step 1: Create the layout file**

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contrib Champs',
}

export default function ContribChampsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

**Step 2: Verify in browser**

Navigate to `/contrib-champs` and confirm the tab reads `Contrib Champs | Backstage ContribFest`.

**Step 3: Commit**

```bash
git add app/contrib-champs/layout.tsx
git commit -m "feat: add page title to Contrib Champs"
```
