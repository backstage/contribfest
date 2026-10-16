// Builds a snapshot of GitHub data for the static site so the browser never
// calls api.github.com directly (shared conference Wi-Fi IPs hit the
// unauthenticated rate limit almost immediately).
//
// Usage:
//   GITHUB_TOKEN=$(gh auth token) yarn fetch-data [mock.json ...]
//   yarn fetch-data --no-github mock.json [mock.json ...]
//
// Mock files add made-up issues for local development (see
// mocks/issues.example.json). --no-github skips GitHub, so no token is needed.
//
// Writes public/data/issues.json and public/data/pull-requests.json.
// Exits non-zero on any failure so CD never deploys a broken snapshot.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

const ROOT = path.resolve(import.meta.dirname, '..')
const CSV_PATH = path.join(ROOT, 'public', 'issues.csv')
const OUT_DIR = path.join(ROOT, 'public', 'data')
const GRAPHQL_URL = 'https://api.github.com/graphql'
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const AVAILABILITIES = ['available', 'assigned', 'has-pr', 'closed']
const MOCK_AUTHOR = 'mock-user'
const DEFAULT_LABEL_COLOR = 'ededed'
const ISSUES_PER_QUERY = 50
const PR_SEARCH_QUERY =
  'repo:backstage/backstage repo:backstage/community-plugins is:pr is:merged label:contribfest'

let token
async function graphql(query, variables = {}, { allowNotFound = false } = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`)
  }
  const body = await response.json()
  const errors = (body.errors ?? []).filter(error => {
    if (allowNotFound && error.type === 'NOT_FOUND') {
      console.warn(`Not found: ${error.message}`)
      return false
    }
    return true
  })
  if (errors.length || !body.data) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(errors, null, 2)}`)
  }
  return body.data
}

// Same rules as the old client-side parser: header row, skip incomplete rows,
// warn on unknown levels, de-dupe on repo + issue number.
function warnOnUnknownLevel(level, location) {
  if (!VALID_LEVELS.includes(level)) {
    console.warn(`Unexpected level value "${level}" at ${location}`)
  }
}

async function readCuratedIssues() {
  const text = await readFile(CSV_PATH, 'utf8')
  const [header, ...lines] = text.split(/\r?\n/).filter(line => line.trim())
  const columns = header.split(',').map(column => column.trim())
  const seen = new Set()
  const rows = []

  lines.forEach((line, index) => {
    const values = line.split(',').map(value => value.trim())
    const row = Object.fromEntries(columns.map((column, i) => [column, values[i]]))
    const issueId = parseInt(row.issueId || '0', 10)

    if (!row.repo || !row.level || !issueId) {
      console.warn(`Skipping invalid row ${index + 2}: ${line}`)
      return
    }
    warnOnUnknownLevel(row.level, `row ${index + 2}`)

    const key = `${row.repo}#${issueId}`
    if (seen.has(key)) return
    seen.add(key)
    rows.push({ repository: row.repo, level: row.level, issueId })
  })

  return rows
}

const ISSUE_FIELDS = `
  number
  title
  state
  url
  createdAt
  updatedAt
  author { login avatarUrl }
  labels(first: 20) { nodes { name color } }
  assignees(first: 5) { nodes { login } }
  closedByPullRequestsReferences(first: 5, includeClosedPrs: true) {
    nodes { number url state author { login } }
  }
  timelineItems(itemTypes: [CROSS_REFERENCED_EVENT], last: 20) {
    nodes {
      ... on CrossReferencedEvent {
        willCloseTarget
        source { ... on PullRequest { number url state author { login } } }
      }
    }
  }
`

async function fetchIssueNodes(rows) {
  const nodes = new Map()

  for (let start = 0; start < rows.length; start += ISSUES_PER_QUERY) {
    const chunk = rows.slice(start, start + ISSUES_PER_QUERY)
    const query = `query {\n${chunk
      .map((row, i) => {
        const [owner, name] = row.repository.split('/')
        return `i${i}: repository(owner: "${owner}", name: "${name}") { issue(number: ${row.issueId}) { ${ISSUE_FIELDS} } }`
      })
      .join('\n')}\n}`

    const data = await graphql(query, {}, { allowNotFound: true })
    chunk.forEach((row, i) => {
      nodes.set(`${row.repository}#${row.issueId}`, data[`i${i}`]?.issue ?? null)
    })
  }

  return nodes
}

// Only PRs that would close the issue count as "someone is working on it".
// Plain mentions are common on umbrella issues and would be false positives.
function getLinkedPullRequests(node) {
  const linked = new Map()
  const add = pr => {
    if (pr?.number && (pr.state === 'OPEN' || pr.state === 'MERGED')) {
      linked.set(pr.url, {
        number: pr.number,
        url: pr.url,
        state: pr.state.toLowerCase(),
        author: pr.author?.login ?? 'ghost',
      })
    }
  }

  node.closedByPullRequestsReferences.nodes.forEach(add)
  node.timelineItems.nodes
    .filter(item => item.willCloseTarget)
    .forEach(item => add(item.source))

  return [...linked.values()]
}

function getAvailability(state, assignees, linkedPRs) {
  if (state === 'closed') return 'closed'
  if (linkedPRs.length > 0) return 'has-pr'
  if (assignees.length > 0) return 'assigned'
  return 'available'
}

function toEnrichedIssue(row, index, node) {
  const base = {
    rowNumber: index + 1,
    repository: row.repository,
    level: row.level,
    issueId: row.issueId,
  }

  if (!node) {
    return { ...base, error: 'Issue not found on GitHub' }
  }

  const state = node.state === 'OPEN' ? 'open' : 'closed'
  const assignees = node.assignees.nodes.map(assignee => assignee.login)
  const linkedPRs = getLinkedPullRequests(node)

  return {
    ...base,
    availability: getAvailability(state, assignees, linkedPRs),
    assignees,
    linkedPRs,
    githubData: {
      number: node.number,
      title: node.title,
      state,
      html_url: node.url,
      user: { login: node.author?.login ?? 'ghost', avatar_url: node.author?.avatarUrl },
      labels: node.labels.nodes,
      created_at: node.createdAt,
      updated_at: node.updatedAt,
    },
  }
}

async function fetchMergedContribfestPullRequests() {
  const pullRequests = []
  let cursor = null

  do {
    const data = await graphql(
      `query($q: String!, $cursor: String) {
        search(type: ISSUE, query: $q, first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            ... on PullRequest {
              databaseId
              number
              title
              url
              createdAt
              mergedAt
              author { login url }
              labels(first: 20) { nodes { name color } }
              repository { nameWithOwner }
            }
          }
        }
      }`,
      { q: PR_SEARCH_QUERY, cursor }
    )

    data.search.nodes.forEach(pr => {
      pullRequests.push({
        id: pr.databaseId,
        number: pr.number,
        title: pr.title,
        state: 'closed',
        html_url: pr.url,
        user: {
          login: pr.author?.login ?? 'ghost',
          html_url: pr.author?.url ?? 'https://github.com/ghost',
        },
        labels: pr.labels.nodes,
        created_at: pr.createdAt,
        merged_at: pr.mergedAt,
        repository: pr.repository.nameWithOwner,
      })
    })

    cursor = data.search.pageInfo.hasNextPage ? data.search.pageInfo.endCursor : null
  } while (cursor)

  pullRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return pullRequests
}

// Turns a minimal mock entry into the same shape as a real snapshot issue.
// Throws with a readable reason when the entry is invalid.
function toMockIssue(entry, generatedAt) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error('must be an object')
  }
  const { repository, issueId, level, title } = entry
  if (typeof repository !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(repository)) {
    throw new Error('"repository" must be a string like "backstage/backstage"')
  }
  if (!Number.isInteger(issueId) || issueId <= 0) {
    throw new Error('"issueId" must be a positive integer')
  }
  if (typeof level !== 'string' || !level) {
    throw new Error('"level" must be a string such as "Beginner"')
  }
  if (typeof title !== 'string' || !title) {
    throw new Error('"title" must be a non-empty string')
  }

  const availability = entry.availability ?? 'available'
  if (!AVAILABILITIES.includes(availability)) {
    throw new Error(`"availability" must be one of ${AVAILABILITIES.join(', ')}`)
  }

  const labels = (entry.labels ?? []).map(label => {
    if (typeof label === 'string') return { name: label, color: DEFAULT_LABEL_COLOR }
    if (label && typeof label.name === 'string') {
      return { name: label.name, color: label.color ?? DEFAULT_LABEL_COLOR }
    }
    throw new Error('"labels" must contain strings or { name, color } objects')
  })

  const assignees = entry.assignees ?? []
  if (!Array.isArray(assignees) || !assignees.every(login => typeof login === 'string')) {
    throw new Error('"assignees" must be an array of strings')
  }

  const linkedPRs = (entry.linkedPRs ?? []).map(pr => {
    if (!pr || !Number.isInteger(pr.number) || pr.number <= 0) {
      throw new Error('"linkedPRs" entries need a positive integer "number"')
    }
    if (pr.state !== undefined && pr.state !== 'open' && pr.state !== 'merged') {
      throw new Error('"linkedPRs" state must be "open" or "merged"')
    }
    return {
      number: pr.number,
      url: pr.url ?? `https://github.com/${repository}/pull/${pr.number}`,
      state: pr.state ?? 'open',
      author: pr.author ?? MOCK_AUTHOR,
    }
  })

  return {
    repository,
    level,
    issueId,
    availability,
    assignees,
    linkedPRs,
    githubData: {
      number: issueId,
      title,
      state: availability === 'closed' ? 'closed' : 'open',
      html_url: `https://github.com/${repository}/issues/${issueId}`,
      user: { login: MOCK_AUTHOR },
      labels,
      created_at: generatedAt,
      updated_at: generatedAt,
    },
  }
}

async function loadMockIssues(paths, generatedAt) {
  const issues = []

  for (const file of paths) {
    let entries
    try {
      entries = JSON.parse(await readFile(path.resolve(file), 'utf8'))
    } catch (error) {
      throw new Error(`Couldn't read mock file ${file}: ${error.message}`)
    }
    if (!Array.isArray(entries)) {
      throw new Error(`${file}: expected a JSON array of mock issues`)
    }

    entries.forEach((entry, index) => {
      try {
        const issue = toMockIssue(entry, generatedAt)
        warnOnUnknownLevel(issue.level, `${file}[${index}]`)
        issues.push(issue)
      } catch (error) {
        throw new Error(`${file}[${index}]: ${error.message}`)
      }
    })
  }

  return issues
}

// Mocks are added after the real issues. A mock with the same repo and issue
// number replaces the earlier entry in place, to simulate a real issue changing.
function mergeIssues(realIssues, mockIssues) {
  const byKey = new Map()
  const keyOf = issue => `${issue.repository}#${issue.issueId}`

  realIssues.forEach(issue => byKey.set(keyOf(issue), issue))
  mockIssues.forEach(issue => {
    if (byKey.has(keyOf(issue))) console.log(`Mock overrides ${keyOf(issue)}`)
    byKey.set(keyOf(issue), issue)
  })

  return [...byKey.values()].map((issue, index) => ({ ...issue, rowNumber: index + 1 }))
}

function parseCommandLine() {
  const { values, positionals } = parseArgs({
    options: { 'no-github': { type: 'boolean', default: false } },
    allowPositionals: true,
  })
  const useGitHub = !values['no-github']
  if (!useGitHub && positionals.length === 0) {
    throw new Error('--no-github needs at least one mock file, otherwise there is nothing to write')
  }
  return { useGitHub, mockFiles: positionals }
}

async function main() {
  const { useGitHub, mockFiles } = parseCommandLine()
  const generatedAt = new Date().toISOString()
  const mockIssues = await loadMockIssues(mockFiles, generatedAt)

  let realIssues = []
  let pullRequests = []
  if (useGitHub) {
    token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error(
        'GITHUB_TOKEN is required. Locally: GITHUB_TOKEN=$(gh auth token) yarn fetch-data, ' +
          'or pass --no-github with mock files'
      )
    }

    const rows = await readCuratedIssues()
    const [issueNodes, fetchedPullRequests] = await Promise.all([
      fetchIssueNodes(rows),
      fetchMergedContribfestPullRequests(),
    ])
    realIssues = rows.map((row, index) =>
      toEnrichedIssue(row, index, issueNodes.get(`${row.repository}#${row.issueId}`))
    )
    pullRequests = fetchedPullRequests
  } else {
    console.log('Skipping GitHub (--no-github): only mock issues, and Contrib Champs will be empty')
  }

  const issues = mergeIssues(realIssues, mockIssues)

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(
    path.join(OUT_DIR, 'issues.json'),
    JSON.stringify({ generatedAt, items: issues }, null, 2)
  )
  await writeFile(
    path.join(OUT_DIR, 'pull-requests.json'),
    JSON.stringify({ generatedAt, items: pullRequests }, null, 2)
  )

  const counts = issues.reduce((acc, issue) => {
    const key = issue.availability ?? 'missing'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const fromMocks = mockIssues.length ? ` (${mockIssues.length} from mocks)` : ''
  console.log(`Wrote ${issues.length} curated issues${fromMocks}:`, counts)
  console.log(`Wrote ${pullRequests.length} merged contribfest pull requests`)
}

main().catch(error => {
  console.error(error.message ?? error)
  process.exit(1)
})
