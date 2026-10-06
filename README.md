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
- `npm run db:seed` inserts or updates the mock customers from `prisma/seed.ts`.

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
- `postinstall` runs `prisma generate` so the Prisma Client matches the schema.

## Continuous integration

GitHub Actions runs dependency installation, formatting, Oxlint, TypeScript, and the production build for pull requests and pushes to `main` or `dev`.

## Vercel

Connect the GitHub repository to Vercel without adding a `vercel.json` file. Use `main` as the Production Branch; pushes to `dev` and other branches receive Vercel Preview Deployments automatically. Set `DATABASE_URL` and `DIRECT_URL` in every Vercel environment, and run `npm run db:deploy` against a database before deploying code that depends on new migrations. Set `NEXT_PUBLIC_APP_URL` in Vercel's Production environment to the production URL when one is available. Leave it unset for Preview deployments unless each preview needs its own canonical metadata URL.

## Architecture

The App Router owns routes under `app/` and API handlers under `app/api/`. Shared constants live in `consts/`, shared types in `types/`, environment configuration in `lib/config/`, database access in `lib/db/` with the Prisma schema in `prisma/`, translations in `lib/i18n/`, and application/server logging in `lib/logging/`. Frontend conventions and engineering rules are documented in `STYLE.md` and `AGENTS.md`.
