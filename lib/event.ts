// Everything that changes from one ContribFest to the next lives here.
// See docs/organizer-runbook.md for the full kickoff checklist.

// Set to true when ContribFest is active
export const CONTRIBFEST_ACTIVE = true

// When the curated issues list unlocks. Include the venue's UTC offset so
// the countdown is the same for everyone regardless of their timezone.
export const ISSUES_UNLOCK_AT = new Date('2026-11-11T00:00:00-07:00')

// The venue's IANA timezone, used to display event dates
export const EVENT_TIMEZONE = 'America/Denver'

export const currentSession = {
  city: 'Salt Lake City',
  details: 'November 11, 2026 at 4:10 PM MST in Room 255 D (Salt Palace, Level 2)',
  sessionUrl: 'https://kubecon-cloudnativecon-north-america-2026.sessionize.com/session/1294770',
  slideDeckPath: '/KubeCon-SLC-Backstage-ContribFest-2026.pdf',
  assignmentSheetUrl:
    'https://docs.google.com/spreadsheets/d/1Bw3fclWcIt7_x7NlpWnJ0DTiaEQqjQ2KkvySiofoHZQ/edit?gid=232343915#gid=232343915',
}

// Shown on the welcome page while CONTRIBFEST_ACTIVE is false
export const offSeasonMessage =
  'Backstage ContribFest will return at KubeCon Barcelona in March 2027, with more details to be shared nearer the date.'
