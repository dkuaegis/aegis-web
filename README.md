# AEGIS Web

The web frontend for AEGIS, providing public club information, study pages, membership onboarding, and member services.

## Features

- Public home, FAQ, recruitment, and contact pages
- Study pages and member services
- Multi-step membership onboarding, including personal information, surveys, coupons, and payment guidance
- Korean and English interface
- Google sign-in and authentication-aware navigation

## Technology

- React 19, TypeScript, and React Router 7
- Vite 8 and Tailwind CSS 4
- Biome for formatting and linting
- TanStack Query and Zustand for client-side state and data

React Router is configured as a client-rendered SPA (`ssr: false`). Production builds are served as static files by Nginx.

## Requirements

- Node.js 24.x (the Docker build uses Node.js 24.21.0)
- pnpm 11.5.1, as declared in `package.json`
- Access to the backend API for features that make API requests

## Local development

```sh
pnpm install --frozen-lockfile
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to the backend API URL. The example file uses `http://localhost:3001`. If the backend runs at a different address, update the URL and, when needed, `VITE_API_PROXY_TARGET` for the Vite development-server proxy.

Start the development server:

```sh
pnpm dev
```

Open the local URL printed by Vite. The `VITE_DEV_BYPASS_AUTH=true` option can be used to preview the join flow without a backend; it is development-only.

## Environment variables

The example values are in [`.env.example`](.env.example). Production containers generate `/runtime-config.js` at startup from the `VITE_` environment variables, allowing the same image to be configured per environment.

The following variables are required when starting the production container:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend API base URL |
| `VITE_PRESIDENT_NAME_KO` | Contact name displayed in Korean |
| `VITE_PRESIDENT_NAME_EN` | Contact name displayed in English |
| `VITE_PRESIDENT_PHONE` | Contact phone number |
| `VITE_ADMIN_ACCOUNT_HOLDER_KO` | Payment account holder displayed in Korean |
| `VITE_ADMIN_ACCOUNT_HOLDER_EN` | Payment account holder displayed in English |

Other values in `.env.example` configure payment contact details, Kakao chat links, analytics, and the development server. Set them as needed for the features and environment in use. `VITE_API_PROXY_TARGET` configures the Vite development-server proxy and defaults to `VITE_API_URL` when unset.

> **Security:** `VITE_` values are exposed to client-side code. Do not put passwords, tokens, or other private credentials in them.

## Available commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Type-check and create the production build in `build/client` |
| `pnpm preview` | Preview the production build locally (run `pnpm build` first) |
| `pnpm check:ci` | Run Biome checks without modifying files |
| `pnpm lint` | Run Biome lint checks |
| `pnpm format` | Format files in place |
| `pnpm check` | Run Biome checks and apply fixes in place |

## Application structure

| Path | Contents |
| --- | --- |
| `app/routes/` | Top-level routes: home, study, join, mypage, FAQ, recruitment, contact, and auth continuation |
| `app/features/home/` | Public home page and shared home layout |
| `app/features/study/` | Study experience |
| `app/features/join/` | Membership onboarding flow |
| `app/features/mypage/` | Member pages and activity |
| `app/i18n/` | Translation provider and Korean/English locale files |
| `app/api/`, `app/lib/` | API and authentication helpers |
| `scripts/` | Build-time and runtime configuration support |
| `docker/`, `nginx/` | Container startup configuration and Nginx settings |

The top-level routes are declared in [`app/routes.ts`](app/routes.ts):

| Route | Page |
| --- | --- |
| `/` | Home |
| `/study/*` | Study pages |
| `/join/*` | Membership onboarding |
| `/mypage/*` | Member services |
| `/faq` | Frequently asked questions |
| `/recruit` | Recruitment information |
| `/contact` | Contact information |
| `/auth/continue` | Continue an authentication intent |

## Production and deployment

The [`Dockerfile`](Dockerfile) builds the client bundle and serves it with Nginx. At container startup, `docker/40-runtime-config.sh` validates the required environment variables and writes `/runtime-config.js`. Configure those variables in the deployment environment; do not bake private credentials into the image.

The GitHub Actions workflow builds and publishes a `linux/arm64` image to GitHub Container Registry and triggers deployment through Coolify for `dev` and `main`. A README-only change is excluded from the workflow's path filters and does not trigger a deployment.

## Troubleshooting a blank or persistent loading page

1. Open the browser developer tools and check the Console and Network panels for JavaScript errors or failed requests.
2. In production, confirm `/runtime-config.js` returns successfully. Check the container logs for missing required environment variables if the runtime configuration was not generated.
3. Confirm the JavaScript and CSS files under `/assets/` load successfully. Nginx intentionally returns `404` for missing fingerprinted assets instead of serving the application shell for those requests.
4. If the page renders but authentication or API-backed features do not work, verify `VITE_API_URL`, backend availability, and the browser's API request and cookie errors.

The root route's client-rendering fallback displays `Loading...` while the application is loading. A persistent fallback should be investigated using the checks above rather than treated as proof of a specific backend or deployment failure.

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE).
