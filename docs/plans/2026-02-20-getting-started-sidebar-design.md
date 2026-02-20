# Getting Started Page — Docs Sidebar Design

**Date:** 2026-02-20
**Branch:** topic/balance-getting-started

## Summary

Add a right-side docs sidebar to the Getting Started page containing 4 resource cards linking to Backstage-related documentation.

## Layout

Two-column flex row in `app/getting-started/page.tsx`:

- **Left column** — existing checklist content (no logic changes)
- **Right column** — `<aside>` ~280px wide, stacked `WelcomeCard` components with a "Resources" heading
- **Mobile (≤768px)** — columns stack vertically, sidebar below checklist

## Components

Reuses the existing `WelcomeCard` component (`components/WelcomeCard.tsx`) and `ResourceCard` type from `lib/types.ts`. No new components or files.

## Data

A `sidebarResources: ResourceCard[]` array at the top of `page.tsx` with 4 placeholder entries. Titles and URLs to be updated by the user.

## Styling

Inline styles with CSS variables, consistent with the rest of the project. No new CSS files.

## Files Changed

- `app/getting-started/page.tsx` — only file modified
