# robots.txt Design

**Date:** 2026-02-25
**Status:** Approved

## Overview

Add an auto-generated `robots.txt` to the site using the Next.js App Router built-in robots support.

## Approach

Use `app/robots.ts` — the idiomatic Next.js 13+ App Router approach, consistent with `app/sitemap.ts`. Next.js automatically generates `robots.txt` during `yarn build`, writing it to the `out/` directory as part of the static export.

## Base URL

`https://contribfest.backstage.io`

## Rules

| Field | Value |
|-------|-------|
| `userAgent` | `*` (all crawlers) |
| `allow` | `/` (entire site) |
| `sitemap` | `https://contribfest.backstage.io/sitemap.xml` |

## Implementation

- **File**: `app/robots.ts`
- **Export**: default function returning `MetadataRoute.Robots`
- **`export const dynamic = 'force-static'`**: required by Next.js 16 when using `output: 'export'` (confirmed during sitemap implementation)

## Expected Output

```
User-Agent: *
Allow: /

Sitemap: https://contribfest.backstage.io/sitemap.xml
```
