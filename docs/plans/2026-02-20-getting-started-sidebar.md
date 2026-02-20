# Getting Started Sidebar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a right-side docs sidebar with 4 `WelcomeCard` resource cards to the Getting Started page.

**Architecture:** Wrap the existing page content in a flex row inside `app/getting-started/page.tsx`. Left column is the unchanged checklist. Right column is an `<aside>` with 4 stacked `WelcomeCard` components. A `sidebarResources` array at the top of the file holds the card data (placeholder titles/URLs for now). Collapses to single column on mobile (≤768px).

**Tech Stack:** Next.js 16, React 19, TypeScript, inline styles with `@backstage/ui` CSS variables, existing `WelcomeCard` component.

---

### Task 1: Add sidebar resource data and layout to the Getting Started page

**Files:**
- Modify: `app/getting-started/page.tsx`

**Step 1: Add the `WelcomeCard` import and `sidebarResources` data array**

At the top of `app/getting-started/page.tsx`, add the import and data below the existing imports:

```tsx
import { WelcomeCard } from '@/components/WelcomeCard'
import type { ResourceCard } from '@/lib/types'
```

After the `forkItemIds` line, add:

```tsx
const sidebarResources: ResourceCard[] = [
  {
    title: 'Placeholder Title 1',
    description: 'A short description of this Backstage resource.',
    url: 'https://backstage.io',
    isExternal: true,
  },
  {
    title: 'Placeholder Title 2',
    description: 'A short description of this Backstage resource.',
    url: 'https://backstage.io',
    isExternal: true,
  },
  {
    title: 'Placeholder Title 3',
    description: 'A short description of this Backstage resource.',
    url: 'https://backstage.io',
    isExternal: true,
  },
  {
    title: 'Placeholder Title 4',
    description: 'A short description of this Backstage resource.',
    url: 'https://backstage.io',
    isExternal: true,
  },
]
```

**Step 2: Wrap the return JSX in a flex row with checklist left and sidebar right**

Replace the outer `<div>` in the `return` statement:

```tsx
return (
  <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
    {/* Main checklist content */}
    <div style={{ flex: 1, minWidth: 0 }}>
      {showCelebration && <Celebration onClose={() => setShowCelebration(false)} />}
      {/* --- paste all existing inner content here unchanged --- */}
    </div>

    {/* Docs sidebar */}
    <aside
      style={{
        width: '280px',
        flexShrink: 0,
      }}
    >
      <h2
        style={{
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: '16px',
          color: 'var(--bui-fg-primary, #000)',
        }}
      >
        Resources
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sidebarResources.map((resource) => (
          <WelcomeCard key={resource.url} {...resource} />
        ))}
      </div>
    </aside>
  </div>
)
```

> Note: move the `{showCelebration && ...}` line inside the left column div. Keep all existing checklist JSX inside the left `<div>`.

**Step 3: Add responsive styles for mobile**

In `app/globals.css`, inside the existing `@media (max-width: 768px)` block, add:

```css
.getting-started-layout {
  flex-direction: column !important;
}

.getting-started-sidebar {
  width: 100% !important;
}
```

Then add `className="getting-started-layout"` to the outer flex div and `className="getting-started-sidebar"` to the `<aside>`.

**Step 4: Verify in the browser**

- Open http://localhost:3000/getting-started
- Confirm 4 cards appear to the right of the checklist on desktop
- Resize to ≤768px and confirm sidebar stacks below the checklist
- Confirm hover effects work on cards (teal border + shadow)
- Confirm checklist behaviour is unchanged

**Step 5: Commit**

```bash
git add app/getting-started/page.tsx app/globals.css
git commit -m "feat: add docs resource sidebar to getting started page"
```
