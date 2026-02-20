# Centralize Session Card Data

**Date:** 2026-02-20

## Problem

The `ContribFestSession` array is copy-pasted identically in two page files:
- `app/contrib-champs/page.tsx`
- `app/hall-of-hosts/page.tsx`

Any update to session data (URLs, dates, new sessions) must be made in both places, with risk of drift.

## Design

Create `lib/sessions.ts` exporting a single `sessions` const array, following the existing `lib/hosts.ts` pattern.

```ts
// lib/sessions.ts
import type { ContribFestSession } from './types';

export const sessions: ContribFestSession[] = [ ... ];
```

Both pages import and use `sessions` directly, removing their inline arrays.

## Files Changed

| File | Change |
|------|--------|
| `lib/sessions.ts` | **Create** — single source of truth for session data |
| `app/contrib-champs/page.tsx` | Remove inline array, import from `lib/sessions` |
| `app/hall-of-hosts/page.tsx` | Remove inline array, import from `lib/sessions` |
