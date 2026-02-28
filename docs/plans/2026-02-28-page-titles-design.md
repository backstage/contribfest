# Page Titles Design

**Date:** 2026-02-28

## Problem

All pages currently share the same static browser tab title: `Backstage ContribFest`. Users cannot distinguish between tabs or see which page they're on from the title.

## Solution

Use Next.js App Router metadata with a title template so each page gets a unique, descriptive title.

## Title Template

Root layout uses:

```ts
title: {
  default: 'Backstage ContribFest',
  template: '%s | Backstage ContribFest',
}
```

## Page Titles

| Route | Browser Title |
|---|---|
| `/` | `Backstage ContribFest` |
| `/getting-started` | `Getting Started \| Backstage ContribFest` |
| `/issues` | `Curated Issues \| Backstage ContribFest` |
| `/contrib-champs` | `Contrib Champs \| Backstage ContribFest` |
| `/hall-of-hosts` | `Hall of Hosts \| Backstage ContribFest` |

## Implementation Notes

- Server component pages (`/`, `/hall-of-hosts`) export `metadata` directly from `page.tsx`.
- Client component pages (`/getting-started`, `/issues`, `/contrib-champs`) use `'use client'` and cannot export metadata. Instead, a sibling `layout.tsx` is created in each route directory to hold the metadata export.

## Files Changed

- `app/layout.tsx` — update title to template format
- `app/hall-of-hosts/page.tsx` — add `metadata` export
- `app/getting-started/layout.tsx` — new file with `metadata` export
- `app/issues/layout.tsx` — new file with `metadata` export
- `app/contrib-champs/layout.tsx` — new file with `metadata` export
