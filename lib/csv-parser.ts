import Papa from 'papaparse'
import type { IssueRow } from './types'

export async function parseIssuesCSV(): Promise<IssueRow[]> {
  try {
    const response = await fetch('/issues.csv')
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse<string[]>(csvText, {
        complete: (results) => {
          try {
            const issues: IssueRow[] = results.data
              .map((row, index) => {
                // Skip empty rows
                if (!row || row.length === 0 || !row[0]) {
                  return null
                }

                // Format: repository,issue_id
                const repository = row[0].trim()
                const issueId = parseInt(row[1]?.trim() || '0', 10)

                if (!repository || !issueId) {
                  console.warn(`Skipping invalid row ${index + 1}:`, row)
                  return null
                }

                return {
                  rowNumber: index + 1,
                  repository,
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

            resolve(uniqueIssues)
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
