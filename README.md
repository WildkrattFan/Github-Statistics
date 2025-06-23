[![CI](https://github.com/WildkrattFan/Github-Statistics/actions/workflows/ci.yml/badge.svg)](https://github.com/WildkrattFan/Github-Statistics/actions/workflows/ci.yml)


# GitHub Statistics Web App

A modern, full-stack SvelteKit application for visualizing GitHub user statistics, language usage, and repository analytics. Features authentication, mock API/data support, robust error handling, and a beautiful, responsive UI.

## Features

- **GitHub OAuth Authentication**: Secure login with GitHub using SvelteKit Auth.
- **User Search**: Search for any GitHub username and view their public repositories and language stats.
- **Language Analytics**: Visualize language usage across all repos and per-repo, with interactive filtering.
- **Modern UI**: Responsive, mobile-friendly design with animated loading states and clean layouts.
- **Mock Data & API**: Supports local development with mock data and MSW (Mock Service Worker).
- **Robust Error Handling**: Consistent JSON error responses for all API endpoints and edge cases.
- **Testing & CI**: Comprehensive unit and API tests, with GitHub Actions CI pipeline.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (frontend & backend)
- [TypeScript](https://www.typescriptlang.org/)
- [@auth/sveltekit](https://authjs.dev/reference/sveltekit) (authentication)
- [MSW](https://mswjs.io/) (mock API)
- [Vitest](https://vitest.dev/) (testing)
- [PostgreSQL](https://www.postgresql.org/) (optional, for production)
- [GitHub Actions](https://github.com/features/actions) (CI/CD)

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/your-username/github-statistics.git
cd github-statistics/github-stats
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env` file in `github-stats/`:
```
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
ENVIRONMENT="dev"
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_SECRET=your_github_secret
AUTH_SECRET=your_auth_secret
```

### 4. Run the app locally
```sh
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run tests
```sh
npm run test
```

## Project Structure

- `src/routes/` — SvelteKit routes (UI, API endpoints)
- `src/lib/` — Utility functions, types, classes, mocks
- `static/mock-data/` — Mock user/repo/language JSON data
- `src/tests/` — Unit and API tests
- `.github/workflows/ci.yml` — GitHub Actions CI pipeline

## Development Notes

- **Mock Data**: In development, API endpoints use mock data from `static/mock-data/` via MSW. In production, real GitHub API is used.
- **Error Handling**: All API errors return JSON with an `error` property and appropriate status code.
- **Testing**: Includes tests for API endpoints and utility classes. Run with `npm run test`.
- **CI/CD**: On every push/PR to `main`, the CI pipeline runs build and tests.

## License

MIT

---

**Made with SvelteKit, TypeScript, and ❤️**
