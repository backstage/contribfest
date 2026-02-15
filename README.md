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

4. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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
