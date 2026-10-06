// Builds a snapshot of GitHub data for the static site so the browser never
// calls api.github.com directly (shared conference Wi-Fi IPs hit the
// unauthenticated rate limit almost immediately).
//
// Usage: GITHUB_TOKEN=$(gh auth token) yarn fetch-data
//
// Writes public/data/issues.json and public/data/pull-requests.json.
// Exits non-zero on any failure so CD never deploys a broken snapshot.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const CSV_PATH = path.join(ROOT, 'public', 'issues.csv')
const OUT_DIR = path.join(ROOT, 'public', 'data')
const GRAPHQL_URL = 'https://api.github.com/graphql'
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const ISSUES_PER_QUERY = 50
const PR_SEARCH_QUERY =
  'repo:backstage/backstage repo:backstage/community-plugins is:pr is:merged label:contribfest'

const token = process.env.GITHUB_TOKEN
if (!token) {
  console.error('GITHUB_TOKEN is required. Locally: GITHUB_TOKEN=$(gh auth token) yarn fetch-data')
  process.exit(1)
}

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
    if (!VALID_LEVELS.includes(row.level)) {
      console.warn(`Unexpected level value "${row.level}" at row ${index + 2}`)
    }

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

async function main() {
  const generatedAt = new Date().toISOString()
  const rows = await readCuratedIssues()
  const [issueNodes, pullRequests] = await Promise.all([
    fetchIssueNodes(rows),
    fetchMergedContribfestPullRequests(),
  ])

  const issues = rows.map((row, index) =>
    toEnrichedIssue(row, index, issueNodes.get(`${row.repository}#${row.issueId}`))
  )

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
  console.log(`Wrote ${issues.length} curated issues:`, counts)
  console.log(`Wrote ${pullRequests.length} merged contribfest pull requests`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
