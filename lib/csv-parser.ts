import Papa from 'papaparse'
import type { IssueRow } from './types'

export async function parseIssuesCSV(): Promise<IssueRow[]> {
  try {
    const response = await fetch(`/issues.csv`)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(csvText, {
        header: true,  // Parse first row as column headers
        complete: (results) => {
          try {
            const issues: IssueRow[] = results.data
              .map((row, index) => {
                // Skip empty rows
                if (!row || !row.repo) {
                  return null
                }

                // Format: repo,level,issueId (with header row)
                const repository = row.repo?.trim()
                const level = row.level?.trim()
                const issueId = parseInt(row.issueId?.trim() || '0', 10)

                if (!repository || !level || !issueId) {
                  console.warn(`Skipping invalid row ${index + 2}:`, row)
                  return null
                }

                // Validate level value
                const validLevels = ['Beginner', 'Intermediate', 'Advanced']
                if (!validLevels.includes(level)) {
                  console.warn(`Unexpected level value "${level}" at row ${index + 2}`)
                }

                return {
                  rowNumber: index + 2, // +2 because header is row 1, and 0-indexed
                  repository,
                  level,
                  issueId,
                }
              })
              .filter((issue): issue is IssueRow => issue !== null)

            // Remove duplicates based on repository + issueId combination
            const seen = new Set<string>()
            const uniqueIssues = issues.filter(issue => {
              const key = `${issue.repository}:${issue.issueId}`
              if (seen.has(key)) {
                return false
              }
              seen.add(key)
              return true
            })

            // Reassign row numbers sequentially starting from 1 for display purposes
            const issuesWithSequentialRows = uniqueIssues.map((issue, index) => ({
              ...issue,
              rowNumber: index + 1,
            }))

            resolve(issuesWithSequentialRows)
          } catch (error) {
            reject(error)
          }
        },
        error: (error: unknown) => {
          reject(error)
        },
        skipEmptyLines: true,
      })
    })
  } catch (error) {
    console.error('Error parsing CSV:', error)
    throw error
  }
}
