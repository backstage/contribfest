# Centralize Session Card Data Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the duplicated `sessions` array into a single `lib/sessions.ts` file and update both pages to import from it.

**Architecture:** Create `lib/sessions.ts` exporting a `sessions` const, mirroring the existing `lib/hosts.ts` pattern. Remove the inline arrays from both page files and replace them with the import.

**Tech Stack:** TypeScript, Next.js (App Router)

---

### Task 1: Create `lib/sessions.ts`

**Files:**
- Create: `lib/sessions.ts`

**Step 1: Create the file**

```ts
import type { ContribFestSession } from './types';

export const sessions: ContribFestSession[] = [
  {
    location: 'Amsterdam',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'March 2026',
    blogUrl:
      'https://kccnceu2026.sched.com/event/2EF7v/contribfest-supercharge-your-open-source-impact-backstage-contribfest-live-andre-wanlin-emma-indal-spotify-heikki-hellgren-op-financial-group-elaine-bezerra-db-systel-gmbh?iframe=no',
    comingSoon: true,
    linkText: 'Add to Schedule',
  },
  {
    location: 'Atlanta',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2025',
    blogUrl:
      'https://backstage.io/blog/2025/11/25/backstagecon-kubecon-25-atlanta/#our-third-backstage-contribfest',
    sched:
      'https://kccncna2025.sched.com/event/27Nl6/contribfest-level-up-your-open-source-journey-hands-on-backstage-contributions-andre-wanlin-patrik-oldsberg-avantika-iyer-spotify-aramis-sennyey-doordash-kurt-king-procore',
  },
  {
    location: 'London',
    subtitle: 'KubeCon + CloudNativeCon Europe',
    date: 'April 2025',
    blogUrl:
      'https://backstage.io/blog/2025/04/29/backstagecon-kubecon-25-london/#backstage-contribfest-goes-across-the-pond',
    sched:
      'https://kccnceu2025.sched.com/event/1tcyr/contribfest-contribute-with-confidence-dive-into-backstage',
  },
  {
    location: 'Salt Lake City',
    subtitle: 'KubeCon + CloudNativeCon North America',
    date: 'November 2024',
    blogUrl:
      'https://backstage.io/blog/2024/12/09/kubecon-slc-24/#contribfest-its-all-about-community',
    sched:
      'https://kccncna2024.sched.com/event/1howP/contribfest-backstage-onboarding-your-journey-to-community-contribution',
  },
];
```

**Step 2: Commit**

```bash
git add lib/sessions.ts
git commit -m "feat: add lib/sessions.ts as single source of truth for session data"
```

---

### Task 2: Update `app/contrib-champs/page.tsx`

**Files:**
- Modify: `app/contrib-champs/page.tsx:1-45`

**Step 1: Replace the import and remove inline array**

Remove lines 6–45 (the `import type { ContribFestSession }` line and the entire `const sessions` array).

Add this import instead:

```ts
import { sessions } from '@/lib/sessions'
```

The file top should become:

```ts
'use client'

import { usePullRequests } from '@/hooks/usePullRequests'
import { PullRequestTable } from '@/components/PullRequestTable'
import { SessionsSidebar } from '@/components/SessionsSidebar'
import { sessions } from '@/lib/sessions'
```

**Step 2: Verify the page still compiles**

Open http://localhost:3000/contrib-champs in a browser. The sessions sidebar should render the same 4 sessions as before.

**Step 3: Commit**

```bash
git add app/contrib-champs/page.tsx
git commit -m "refactor: import sessions from lib/sessions in contrib-champs page"
```

---

### Task 3: Update `app/hall-of-hosts/page.tsx`

**Files:**
- Modify: `app/hall-of-hosts/page.tsx:1-43`

**Step 1: Replace the import and remove inline array**

Remove lines 4–43 (the `import type { ContribFestSession }` line and the entire `const sessions` array).

Add this import instead:

```ts
import { sessions } from '@/lib/sessions';
```

The file top should become:

```ts
import { HostCard } from '@/components/HostCard';
import { SessionsSidebar } from '@/components/SessionsSidebar';
import { hosts } from '@/lib/hosts';
import { sessions } from '@/lib/sessions';
```

**Step 2: Verify the page still compiles**

Open http://localhost:3000/hall-of-hosts in a browser. The sessions sidebar should render the same 4 sessions as before.

**Step 3: Commit**

```bash
git add app/hall-of-hosts/page.tsx
git commit -m "refactor: import sessions from lib/sessions in hall-of-hosts page"
```
