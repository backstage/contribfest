# Hall of Hosts — Design Doc

**Date:** 2026-02-20
**Branch:** topic/hall-of-hosts
**Status:** Approved

---

## Summary

Add a new "Hall of Hosts" page to the ContribFest site that celebrates the people who have hosted ContribFest sessions at KubeCon events. The page displays a grid of profile cards and includes the same "Past ContribFest Sessions" sidebar used on the Contrib Champs page.

---

## Files

| File | Action | Notes |
|------|--------|-------|
| `components/Sidebar.tsx` | Modify | Add Hall of Hosts entry at bottom of `navigationLinks` |
| `lib/hosts.ts` | Create | `Host` type + `hosts` array (populated later) |
| `components/HostCard.tsx` | Create | Profile card component |
| `app/hall-of-hosts/page.tsx` | Create | Page using two-column layout |
| `public/img/hosts/` | Create | Folder for local profile images |

---

## Sidebar

Add to the bottom of `navigationLinks` in `components/Sidebar.tsx`:

```ts
{ href: '/hall-of-hosts/', label: 'Hall of Hosts', emoji: '🙏' }
```

Follows the same active/hover behavior as all other nav items.

---

## Data Shape

**`lib/hosts.ts`**

```ts
export interface Host {
  name: string
  title: string
  company: string
  kubecon: string      // e.g. "KubeCon NA 2024 – Salt Lake City"
  imagePath: string    // e.g. "/img/hosts/jane-doe.jpg"
}

export const hosts: Host[] = []
```

Profile images stored locally in `public/img/hosts/`.

---

## HostCard Component

**`components/HostCard.tsx`**

Layout (top to bottom):
1. Circular profile photo — 80×80px, centered, `border-radius: 50%`
2. Name — bold, `var(--bui-fg-primary)`
3. Title — `var(--bui-fg-secondary)`, smaller font
4. Company — `var(--bui-fg-secondary)`, smaller font
5. KubeCon badge — styled chip using `var(--bui-bg-solid)` teal background with white text

Card shell: same hover effect as `WelcomeCard` (border color change + box-shadow on hover). Background `var(--bui-bg-popover)`, border `var(--bui-border-1)`.

---

## Page Layout

**`app/hall-of-hosts/page.tsx`**

Two-column layout identical to ContribChamps (`contrib-champs-layout` CSS class):

- **Left (main):** `🙏 Hall of Hosts` heading + brief description + responsive card grid
- **Right:** Reuses `<SessionsSidebar />` component as-is

Card grid CSS: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` — 3-4 cols desktop, 2 tablet, 1 mobile.

Empty state: shows a placeholder message when `hosts` array is empty.

---

## Constraints

- No Tailwind — inline styles using CSS variables only, matching existing patterns
- Static export compatible (no server components that fetch data)
- Light and dark theme both supported via CSS variables
- Responsive without custom breakpoints (CSS grid auto-fill handles it)
