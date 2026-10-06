# Organizer Runbook

How to run the site for each ContribFest. Event-specific settings live in `lib/event.ts`.

## Kickoff (a few months before the event)

1. In `lib/event.ts`:
   - Set `CONTRIBFEST_ACTIVE = true`
   - Set `ISSUES_UNLOCK_AT` to the event day, including the venue's UTC offset, and `EVENT_TIMEZONE` to the venue's timezone
   - Update `currentSession` (city, date/time/room, session link, slide deck path, assignment sheet URL)
   - Update `offSeasonMessage` to point at the following event
2. In `lib/sessions.ts`, add the new session as `comingSoon` and move the previous one to past events.
3. In `lib/hosts.ts`, add new hosts (avatars in `public/img/avatars/`) and add them to `.github/CODEOWNERS`.
4. Add the slide deck PDF to `public/` once it's ready.

## Curating Issues

1. Find small, well-scoped issues in `backstage/backstage` and `backstage/community-plugins`.
2. Add the `contribfest` label. Don't use `good first issue` before the event; those get picked up quickly.
3. Leave a comment so nobody picks it up early:

   > Do not work on this issue: it's reserved for the Backstage ContribFest at KubeCon on <date>. If it's still open afterwards, it'll be opened up to everyone.

4. Add a row to `public/issues.csv`: `repo,level,issueId` (level is `Beginner`, `Intermediate`, or `Advanced`).
5. Optionally pin umbrella issues in `lib/pinned-issues.ts`.

## Health Check (week before, and the morning of)

Open `/issues/?admin=true`, set **Availability** to **All**, and look for issues that are no longer available:

- **Closed**: remove from `public/issues.csv`
- **Has PR**: someone is already working on it; remove or leave as a reference
- **Assigned**: check whether the assignee is a host or someone else

Replace them with fresh issues if needed. If the list runs low, that's fine: the issues page sends people to `/ideas/` to bring their own ideas.

## During the Session

- GitHub data refreshes every hour. For an immediate refresh, run the **CD** workflow from the Actions tab (takes about 2-3 minutes).
- Attendees claim issues in the assignment sheet; the site's availability badges show what's already taken on GitHub.

## After the Event

1. Set `CONTRIBFEST_ACTIVE = false` in `lib/event.ts`.
2. Run the `remove-contribfest-label` Claude skill to remove the label and add `good first issue` to Beginner issues.
3. Merged PRs labeled `contribfest` will keep appearing on Contrib Champs.
