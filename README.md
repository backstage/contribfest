# ContribFest

> [!NOTE]
> This repository is not currently accepting contributions. While we appreciate your interest in the project, we're not set up to handle external contributions at this time. Thank you for your understanding!

## About

ContribFest is a web application built with Next.js, React, and TypeScript.

## Development

### Setup

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Configure your environment variables in `.env.local`:
   - `NEXT_PUBLIC_GA_ID`: Your Google Analytics GA4 Measurement ID (optional)

3. Install dependencies:

```bash
yarn install
```

4. Fetch the GitHub data snapshot used by the issues and Contrib Champs pages:

```bash
GITHUB_TOKEN=$(gh auth token) yarn fetch-data

# Optionally add mock issues (see mocks/issues.example.json)
GITHUB_TOKEN=$(gh auth token) yarn fetch-data mocks/issues.example.json

# Or use only mock issues, with no GitHub token needed
yarn fetch-data --no-github mocks/issues.example.json
```

5. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application. See [docs/deployment.md](docs/deployment.md) for how the snapshot is refreshed in production, and [docs/organizer-runbook.md](docs/organizer-runbook.md) for running an event.

## Build

```bash
yarn build
```

## Deployment

This project is configured to deploy to GitHub Pages via GitHub Actions. To enable Google Analytics in production:

1. Go to your repository's **Settings** > **Secrets and variables** > **Actions**
2. Add a new repository secret:
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: Your Google Analytics GA4 Measurement ID (e.g., `G-XXXXXXXXXX`)

The CD workflow will automatically include this in production builds.

## License

See [LICENSE](LICENSE) for more information.
