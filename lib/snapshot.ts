import type { Snapshot } from './types'

// Loads a JSON snapshot written at build time by scripts/fetch-github-data.mjs.
// `no-cache` revalidates with the CDN so a fresh deploy shows up right away.
export async function fetchSnapshot<T>(name: 'issues' | 'pull-requests'): Promise<Snapshot<T>> {
  const response = await fetch(`/data/${name}.json`, { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`Couldn't load the latest GitHub data (${response.status}). Please refresh in a minute.`)
  }
  return response.json() as Promise<Snapshot<T>>
}

export function formatUpdatedAgo(generatedAt: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - new Date(generatedAt).getTime()) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  return new Date(generatedAt).toLocaleDateString()
}
