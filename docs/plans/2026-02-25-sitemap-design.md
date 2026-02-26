# Sitemap Design

**Date:** 2026-02-25
**Status:** Approved

## Overview

Add an auto-generated `sitemap.xml` to the site using the Next.js App Router built-in sitemap support.

## Approach

Use `app/sitemap.ts` — the idiomatic Next.js 13+ App Router approach. Next.js automatically generates `sitemap.xml` during `yarn build`, writing it to the `out/` directory as part of the static export. No manual XML authoring or custom scripts required.

## Base URL

`https://contribfest.backstage.io`

## Routes

| URL | Notes |
|-----|-------|
| `https://contribfest.backstage.io/` | Home |
| `https://contribfest.backstage.io/contrib-champs/` | Contrib Champs page |
| `https://contribfest.backstage.io/getting-started/` | Getting Started page |
| `https://contribfest.backstage.io/hall-of-hosts/` | Hall of Hosts page |
| `https://contribfest.backstage.io/issues/` | Issues page |

Trailing slashes are consistent with `trailingSlash: true` in `next.config.ts`.

## Implementation

- **File**: `app/sitemap.ts`
- **Export**: default function returning `MetadataRoute.Sitemap`
- **`lastModified`**: set to `new Date()` at build time
- **No** `changeFrequency` or `priority` fields (largely ignored by search engines)

## Adding Future Routes

Add a new entry to the array in `app/sitemap.ts` when new pages are created.
