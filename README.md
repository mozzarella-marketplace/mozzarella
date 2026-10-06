# Mozzarella

Mozzarella (מוצרלה) is a learning platform for basic programming. Students begin with a real-world problem from a simulated customer, clarify the need through conversation, express it as a user story, and then build and test a solution with code.

The platform is aimed primarily at high-school students learning introductory C# or Java, including variables, conditions, loops, methods, input/output, problem decomposition, and algorithmic thinking.

## Stack

- Next.js with the App Router
- TypeScript with strict checking
- Tailwind CSS
- Oxlint and Oxfmt
- Lucide React
- npm

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` only when local deployment configuration is needed. `.env.local` is ignored by Git and must never contain values that are committed or shared. Environment variables are validated centrally by `lib/config/env.ts`.

## Login endpoint

`POST /api/auth/login` accepts JSON with `classId` and `userId`, each exactly four hexadecimal characters. The server normalizes them to uppercase and sends `<classId>-<userId>` as both the username and password to Keycloak using a confidential client's Direct Access Grant.

Configure `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, and `KEYCLOAK_CLIENT_SECRET` in the ignored `.env.local` (an existing `.env` is also loaded by Next.js). These are server-only variables; never prefix them with `NEXT_PUBLIC_`. The local issuer is `http://localhost:8080/realms/mozzarella`, and the client is `nextjs`. The issuer determines the token endpoint. Keycloak must be running with Direct Access Grants enabled on that client.

Successful requests return the validated Keycloak token response with `Cache-Control: no-store`. Invalid input returns `400`; rejected authentication returns a generic `401`. Missing configuration, connection failures/timeouts, or invalid successful token responses return a generic `503`. The variables may be omitted for builds that do not use login; provided values are validated centrally. No sessions, cookies, database access, or custom authenticator are implemented. Tokens and credentials are never logged. Knowing the identifier pair is currently sufficient to authenticate an existing account with matching credentials; this endpoint does not verify class membership or provide an additional identity factor.

## Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Quality scripts

- `npm run build` builds the production application.
- `npm run start` starts the production server.
- `npm run lint` runs Oxlint.
- `npm run format` formats the repository with Oxfmt.
- `npm run format:check` checks formatting without changing files.
- `npm run typecheck` runs the strict TypeScript check.

## Continuous integration

GitHub Actions runs dependency installation, formatting, Oxlint, TypeScript, and the production build for pull requests and pushes to `main` or `dev`.

## Vercel

Connect the GitHub repository to Vercel without adding a `vercel.json` file. Use `main` as the Production Branch; pushes to `dev` and other branches receive Vercel Preview Deployments automatically. Set `NEXT_PUBLIC_APP_URL` in Vercel's Production environment to the production URL when one is available. Leave it unset for Preview deployments unless each preview needs its own canonical metadata URL.

## Architecture

The App Router owns routes under `app/` and API handlers under `app/api/`. Shared constants live in `consts/`, shared types in `types/`, environment configuration in `lib/config/`, translations in `lib/i18n/`, and application/server logging in `lib/logging/`. Frontend conventions and engineering rules are documented in `STYLE.md` and `AGENTS.md`.
