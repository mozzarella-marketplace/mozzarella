# Agent instructions

## Purpose

Mozzarella (מוצרלה) is a Hebrew-first learning platform for introductory programming. Students discover and solve real-world problems for simulated customers: customer, conversation, understanding, user story, solution, code, and result.

Implement Mozzarella as a Hebrew-first programming-learning platform. Students solve real-world problems through simulated customers: customer, conversation, understanding, user story, solution, code, and result. This document defines engineering rules for the permanent project baseline; product requirements belong in the relevant feature or product documentation.

## Stack

Use Next.js App Router, TypeScript in strict mode, Tailwind CSS, Oxlint, Oxfmt, Lucide React, and npm.

## Directory conventions

- `app/`: routes, layouts, and application entry points
- `app/api/`: Next.js App Router API route handlers when an API is required
- `components/`: reusable React components when reuse is justified
- `consts/`: fixed application and domain constants
- `lib/`: shared utilities and application helpers
- `lib/config/`: centralized environment and deployment configuration
- `lib/i18n/`: translation resources and i18n helpers
- `lib/logging/`: the application/server logging entry point
- `types/`: shared application and domain types
- `public/`: static assets

Do not add folders or abstractions without a concrete need. Do not create `components/ui` or a custom UI library unless a feature requires it.

## Coding conventions

- Inspect existing code and documentation before introducing an abstraction.
- Preserve strict TypeScript and keep server/client boundaries explicit.
- Prefer small, focused modules and existing platform or library capabilities.
- Implement product features only when requested, using the existing architecture and only the code required by the feature.
- Do not leave dead code, commented-out implementations, abandoned abstractions, duplicate implementations, or unused configuration in the repository.
- Prefer simple, readable, explicit code over clever abstractions or implicit magic.
- Use descriptive names, focused functions, and shallow control flow. Avoid unnecessary type assertions, duplication, and `any`.
- Keep business logic separate from UI concerns and domain logic separate from infrastructure concerns.
- Before adding a dependency, confirm the existing platform or installed dependencies cannot provide the capability.
- Format with Oxfmt and keep lint clean with Oxlint.

## Dead code

There must be no dead code. Remove unused variables, imports, functions, constants, types, schemas, components, files, dependencies, configuration, unreachable branches, commented-out implementations, abandoned abstractions, and duplicate implementations. Do not keep code because it might be useful later; add it when a current feature or architectural boundary needs it.

## Naming

- Use `camelCase` for variables and functions and `PascalCase` for React components and types.
- Use `UPPER_SNAKE_CASE` only for constants that genuinely represent named fixed values.
- Prefer descriptive names over abbreviations or generic names such as `data`, `thing`, `helper`, or `utils`.
- Use one consistent file and directory naming convention within each area of the repository; follow the existing nearby convention before introducing a new one.

## React conventions

- Use named function declarations for components. Do not use `React.FC`.
- Do not add `: JSX.Element` return annotations unless there is a specific reason.
- Prefer composition over large monolithic components.
- Keep components focused on presentation and interaction, and move reusable business logic outside components.

## RTL and language

Hebrew is the primary and default locale. Locale constants in `consts/locales.ts` and shared types in `types/locale.ts` determine document language and direction; do not hard-code RTL in components. Translation resources live under `lib/i18n/messages/`, use namespaced lower-case keys, and are accessed through the i18n helpers. Add every user-facing string to a resource before using it. To add a language, register its locale and direction, add its resource module, and register that resource with the message loader. Locale selection is a product concern and must use this architecture.

Use logical CSS properties such as `margin-inline`, `padding-inline`, and `inset-inline`. Handle mixed Hebrew, Latin, code, and numeric content deliberately, and do not assume word order, punctuation, or spacing is shared across locales.

## Configuration, constants, types, and validation

- Define environment variable names and local setup guidance in `.env.example`; use `.env.local` for machine-specific values. `.env.local` is ignored by Git and must never be committed.
- Read environment variables only through `lib/config/env.ts`, which validates them with Zod at startup. Do not access `process.env` elsewhere.
- To add an environment variable, document it in `.env.example` when it is safe to show, add it to the Zod schema, expose only the typed parsed value needed by the application, and document whether it is server-only or browser-safe.
- Only variables intentionally prefixed with `NEXT_PUBLIC_` may be exposed to browser bundles. Secrets, tokens, passwords, private URLs, and personal data must remain server-only and must never be logged or exposed to client-side code.
- `NODE_ENV` is managed by the framework/runtime and is validated by the schema; do not treat it as arbitrary application configuration or duplicate it as a project constant.
- Application configuration is for deployment-dependent values such as public application URLs, API endpoints, feature flags, and external service settings. Secrets must remain server-only and must never use a `NEXT_PUBLIC_` name.
- Fixed application or domain values belong in `consts/`; shared compile-time contracts belong in `types/`. Keep feature-local values and types local when they are not shared.
- Use named constants and explicit unions for meaningful reusable values. Do not duplicate domain values or add constants that only wrap an obvious local literal.
- Use Zod at external boundaries such as environment variables, API input/output, user input, external integrations, and persisted data when needed. Derive types from schemas when practical; do not validate every internal function argument.
- Avoid TypeScript `enum` by default and never use `any` to avoid defining a meaningful type.

## Accessibility and styling

Use semantic HTML, keyboard-accessible interactions, visible focus states, sufficient contrast, accessible names, and reduced-motion support. Follow `STYLE.md` for typography, spacing, colors, responsive behavior, icons, and component conventions. Use Lucide React for interface icons; do not add custom icon drawings without a clear reason.

## Quality checks

Run the following before handing off changes:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Use `npm run dev` for local development and `npm run format` only when intentionally applying formatting.

AI agents and human contributors must inspect `AGENTS.md`, relevant documentation, and nearby code before making changes. After changes, run formatting, linting, TypeScript checks, relevant tests when they exist, and the production build when appropriate. Do not claim a check passed unless it was actually run.

Pull requests and pushes to `main` run the same quality sequence in `.github/workflows/ci.yml`: `npm ci`, `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build`.

If tests exist, run the relevant test command as part of the quality checks. Keep CI aligned with the canonical npm scripts.

## Logging

- Application and server logging belongs in `lib/logging/logger.ts`; use its `logger` entry point instead of arbitrary `console` calls in production code.
- Log concise, actionable events and safe identifiers only. Use `logger.error` for failures, with a stable message and sanitized context; do not log raw request bodies, exception payloads, or user content by default.
- Never log secrets, tokens, passwords, credentials, personal data, or other sensitive information.
- Do not leave temporary debugging logs or arbitrary `console.log()` calls in production code. A more capable logging system should be introduced only when a concrete operational need justifies it.

## Dependency policy

- Do not add a dependency when the platform or installed stack can reasonably solve the problem.
- Before adding one, check whether an existing dependency already provides the required capability.
- Avoid dependencies that provide only trivial functionality, and do not add libraries merely because they are common in Next.js projects.
- Prefer focused, well-maintained packages with a clear purpose, and never introduce multiple libraries that solve the same problem.
- Keep dependencies current through deliberate, reviewed changes rather than uncontrolled automatic upgrades. The reason for each necessary dependency should be evident from the code and documentation.

## API boundaries

API routes belong under `app/api/` when a feature requires them. Validate API inputs and external data with Zod at the boundary, keep authentication and domain logic in their appropriate modules, and do not introduce API infrastructure without an actual API use case.

## Git commits

- Use Conventional Commits for every commit: `type(scope): emoji description`.
- Allowed types are `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `build`, `ci`, and `perf`.
- Use a meaningful lowercase scope when the change clearly belongs to one area, place the emoji after the colon, and write a short imperative description.
- Keep commits small, focused, and coherent. Do not mix unrelated features, dependency changes, formatting churn, or documentation changes.
- Examples: `feat(marketplace): ✨ add customer filtering`, `fix(chat): 🐛 prevent empty messages`, `docs(readme): 📝 update setup instructions`.

## Documentation ownership

- `AGENTS.md` owns engineering rules for agents and contributors.
- `STYLE.md` owns frontend visual, styling, accessibility, and component conventions.
- `README.md` owns project context, setup, development, and high-level workflow information.

Update the document that owns a rule rather than duplicating large policy sections across documents. Keep all documentation consistent with the implementation.

## Product development

Authentication, database integration, AI integration, customer workflows, exercises, submissions, progress, gamification, and other product capabilities may be implemented when explicitly requested. Inspect the relevant architecture first, reuse existing capabilities, keep domain/UI/infrastructure boundaries clear, validate external data, and avoid speculative infrastructure.
