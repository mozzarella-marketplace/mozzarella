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

Copy `.env.example` to `.env.local` and set `DATABASE_URL` (and `DIRECT_URL`, when the provider pools connections) before installing, because `npm install` generates the Prisma Client. `.env.local` is ignored by Git and must never contain values that are committed or shared. Environment variables are validated centrally by `lib/config/env.ts`.

```bash
npm install
npm run db:migrate
npm run db:seed
```

## Database

Mozzarella stores its data in PostgreSQL through Prisma ORM. The schema and migrations live in `prisma/`, and `prisma.config.ts` loads `DIRECT_URL` from `.env.local` for the Prisma CLI, which needs an unpooled connection for migrations. The app's own Prisma Client (`lib/db/prisma.ts`) reads the pooled `DATABASE_URL` directly at runtime and does not go through `prisma.config.ts`. The Prisma Client is generated into `lib/generated/prisma/` (ignored by Git) and is used only through `lib/db/prisma.ts`.

- `npm run db:migrate` creates and applies migrations during development.
- `npm run db:deploy` applies committed migrations to a deployed database.
- `npm run db:seed` inserts or updates 16 mock customers from `prisma/seed.ts`. Fixed IDs keep reruns from creating duplicates.
- `npm run db:reset` prompts for confirmation, deletes all application database data, reapplies migrations, and seeds the mock customers. Use only with a development database; `DIRECT_URL` and `DATABASE_URL` must point to the same database. Keycloak is unchanged. Run `npm run keycloak:setup` afterward to restore the example classes and student mappings.

## Authentication

Authentication uses the app-owned Class ID + User ID form and Keycloak 26.8.0 Direct Access Grants. Each identifier is exactly four hexadecimal characters; the server normalizes both to uppercase and submits `<CLASS_ID>-<USER_ID>` as both username and password to the confidential `nextjs` client, requesting the `openid` scope required by UserInfo (not profile or email scopes). Keycloak authenticates the credentials, and the server calls the OIDC UserInfo endpoint to obtain the verified subject. The app grants access only when that subject maps to an existing `User` row; it does not create users or trust browser-supplied class membership.

Configure `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, and `KEYCLOAK_CLIENT_SECRET` in ignored `.env.local`. Keep them server-only; never prefix them with `NEXT_PUBLIC_`. The local issuer is `http://localhost:8080/realms/mozzarella`, and the client ID is `nextjs`. Never commit or share client credentials. Rotate any client secret previously exposed during development, and update `.env.local` and the Vercel environment settings.

To use a future Railway-hosted Keycloak, change these environment values to its public HTTPS issuer and client credentials; no application-code changes are required. The Keycloak image imports the realm on first startup and preserves it on later starts. See [Keycloak deployment setup](Keycloak/README.md#future-railway-connection) for service, database, hostname, and proxy configuration.

After successful credential authentication, the server verifies the Keycloak subject through UserInfo, maps it to the existing app `User`, and places Keycloak access and refresh tokens in `HttpOnly` cookies. Browser JavaScript cannot read the tokens; the UI receives only a success response. Keycloak controls token expiry and refresh. Protected server operations validate the access token through UserInfo and use the refresh grant when needed. `POST /api/auth/logout` revokes the Keycloak refresh session and clears both cookies. HTTPS deployments set the cookies' `Secure` flag. Login and logout require a same-origin `Origin` header. The database stores user identity mapping and class membership, not authentication sessions. Use `requireAuth()` in route handlers or server actions that can update cookies when refresh-token rotation occurs; `getCurrentUser()` checks the current access token without refreshing it.

Apply the committed migrations with `npm run db:deploy` before deploying. Populate the `users` mapping through a reviewed server-side provisioning process; unmapped Keycloak subjects are denied. Create each class before its users: `users.class_id` references the unique `classes.class_id`, and classes with users cannot be deleted. Authentication also requires an existing class. The class-link migration rejects orphaned user mappings; review and correct those mappings before applying it rather than deleting users or inventing classes automatically. Keycloak's realm brute-force protection is enabled.

The header's logout button calls `POST /api/auth/logout` and returns to login on success. While the request is pending, the button is disabled; failed requests show a localized error and allow retrying.

Pages under `app/(protected)/` share an authenticated layout; their public URLs do not include the route-group name. Unauthenticated visitors redirect to `/login?returnTo=...`. Login and session-refresh redirects omit the parameter when the validated destination is exactly `/`; home URLs with a query or fragment still preserve it. Middleware forwards the current pathname and query through an overwritten internal request header so the server layout can preserve the destination. The login page stays outside the group. After login, or when already authenticated, users return to the validated `returnTo` destination (default `/`). Only internal page paths are accepted; external URLs, malformed paths, login, API, and Next.js asset destinations fall back to `/` to prevent open redirects and auth loops.

Page checks use `getPageUser(returnTo)`, which sends browsers with an expired or rejected access token and a remaining refresh cookie through `/api/auth/session?returnTo=...`. That route verifies or refreshes the Keycloak session and writes rotated cookies before returning to the destination. Invalid sessions clear both cookies and redirect to login while preserving `returnTo`; service failures return a non-cacheable `503` rather than redirecting in a loop. These redirects reuse the app's Keycloak tokens. URL fragments are not sent to the server, so automatic capture preserves the pathname and query, not the fragment. This restores navigation, not unsaved form state.

The shared layout is a navigation guard, not an authorization boundary for data or mutations: layouts can be reused during client navigation. Server Components and their data-access functions must independently call the read-only `getCurrentUser()` and enforce any required ownership or class checks before fetching protected data; use `getPageUser(returnTo)` when a page needs the refresh redirect. Do not call `requireAuth()` during Server Component rendering: it may write cookies. Use it in API handlers and server actions, which support cookie writes; state-changing handlers must also enforce same-origin requests. Currently the only authenticated API operation is the session verification/refresh route, which already calls `requireAuth()`. Login and logout remain callable without authentication so users can establish a session or clear invalid cookies.

Authentication network and database failures are logged without tokens or user content and reported as unavailable, not as rejected credentials. Page-rendering failures show a localized retry screen without exposing exception details. If login fails after Keycloak issues tokens, the app attempts to revoke that new session; cleanup failures are logged. The app revokes a previous Keycloak session only after the new token cookies have been set successfully.

Malformed input returns `400`, oversized input `413`, rejected credentials a generic `401`, and unavailable services a generic `503`; all responses are non-cacheable. The password-equals-identifier scheme has limited entropy, so keep Keycloak brute-force protection enabled and provision accounts carefully.

## Local development

For local authentication, follow the [container setup](Keycloak/README.md#local-setup) using OrbStack or another Docker-compatible runtime. Compose runs Keycloak and two separate PostgreSQL containers with persistent storage. Fill the eight values in `Keycloak/.env` using `Keycloak/.env.example`, then set application `DATABASE_URL` and `DIRECT_URL` in `.env.local` to the `APP_POSTGRES_*` credentials on `localhost:5432` (URL-encode the password). Run:

```bash
npm run keycloak:setup
```

The demo flow is the authenticated customer marketplace: customer cards come from active database records, with search and category filters. Selecting a card opens the customer conversation and user-story workspace. Students can interview the simulated customer through Anthropic's Claude API, then format, save, and reload a Java or C# user-story draft. Set the server-only `ANTHROPIC_API_KEY` in `.env.local` to enable conversations, then restart `npm run dev`; the key is never sent to the browser. Conversations and drafts are scoped to the authenticated student and selected customer, with the session identifier derived on the server. Conversation messages are stored in the application database and sent to Anthropic to generate replies; students are warned not to submit personal information. Each student can send up to 30 messages per UTC day. The draft is one evolving document per student/customer, not multiple attempts or a version history.

Apply migrations with `npm run db:deploy` after updating the code, then restart the development server to load the regenerated Prisma Client. The integration migration restores the programming-language enum removed by the earlier customer-schema cleanup before the workspace's language migration uses it. Existing unscoped example drafts are retained but are not displayed to students.

Sending a conversation message immediately adds it to the chat and clears the input. If the customer has not replied after 500 ms, a three-dot typing indicator appears until the reply arrives. Failed requests remove the unsaved message, restore the input for retry, and show an error.

The conversation and user-story workspace sit side by side on desktop screens (1,024 px and wider) and stack on smaller screens.

This local-only command starts Compose, waits for the imported realm and application database, applies application migrations to the configured database, seeds marketplace customers, creates two example classes and five students, and writes the local issuer/client secret into ignored `.env.local` without printing secrets. It preserves existing passwords and unrelated accounts and refuses conflicting mappings. Restart the app afterward. Examples are for development only: class `B001` has students `1001`, `1002`, `1003`; class `B002` has students `2001`, `2002`. New example accounts use `<CLASS_ID>-<USER_ID>` as username and password. Reruns reuse the marked example accounts; they do not reset passwords. Do not point the application database configuration at a production database when running this command.

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
- `npm test` checks bounded JSON request parsing and login input regression cases.
- `postinstall` runs `prisma generate` so the Prisma Client matches the schema.

## Continuous integration

GitHub Actions runs dependency installation, formatting, Oxlint, TypeScript, and the production build for pull requests and pushes to `main` or `dev`.

## Vercel

Connect the GitHub repository to Vercel without adding a `vercel.json` file. Use `main` as the Production Branch; pushes to `dev` and other branches receive Vercel Preview Deployments automatically. Set `DATABASE_URL` and `DIRECT_URL` in every Vercel environment, and run `npm run db:deploy` against a database before deploying code that depends on new migrations. Set `NEXT_PUBLIC_APP_URL` in Vercel's Production environment to the production URL when one is available. Leave it unset for Preview deployments unless each preview needs its own canonical metadata URL.

## Architecture

The App Router owns routes under `app/` and API handlers under `app/api/`. Shared constants live in `consts/`, shared types in `types/`, environment configuration in `lib/config/`, database access in `lib/db/` with the Prisma schema in `prisma/`, translations in `lib/i18n/`, and application/server logging in `lib/logging/`. Frontend conventions and engineering rules are documented in `STYLE.md` and `AGENTS.md`.
