# Keycloak infrastructure

This directory owns the Keycloak container, its dedicated database, and the canonical `mozzarella` realm configuration. The Next.js app uses this realm for server-side credential authentication. The local setup command provisions development-only example students; production account provisioning remains an administrative responsibility.

## Architecture and ownership

The intended production architecture is:

```text
Browser -> Next.js / Vercel -> OIDC -> Keycloak / Railway
                                         |
                                         v
                              Keycloak PostgreSQL / Railway

Next.js / Vercel -> Application PostgreSQL / Supabase
```

Keycloak owns credentials and OIDC token issuance. Next.js verifies the authenticated subject through UserInfo, maps it to the application database, and manages the browser session and access checks. Class membership comes from the application database. No separate Express or Node backend is introduced.

Keycloak requires its own PostgreSQL database for its internal realms, credentials, sessions, clients, and configuration. The application database on Supabase will be the source of truth for application-specific student/class data. Never share the database, database user, connection URL, or credentials between these systems. Locally, Compose creates only Keycloak and its dedicated PostgreSQL service; it does not start or connect to Supabase or the application database.

## Local setup

For the app and example accounts, run `npm run keycloak:setup` from the repository root after filling `Keycloak/.env` and the application database configuration in `.env.local`. It performs the Compose startup/import steps below, applies app migrations, provisions two classes and five student mappings, and saves the local client secret in ignored `.env.local`. It registers an admin-only `localFixture` user-profile attribute to identify setup-owned accounts. It never resets passwords or overwrites conflicting identities. Partial failures may leave newly created Keycloak examples; fix the reported problem and rerun to finish their database mappings. See the root [README](../README.md#local-development) for example login codes. The configured app database is modified, so use a development database only.

Prerequisites: Docker with Docker Compose v2, a running Docker daemon, and port 8080 available. Run these commands from the repository root:

```bash
cd Keycloak
cp .env.example .env
```

Edit the ignored `.env` and fill all five variables. Choose a dedicated database name and user, a bootstrap administrator username, and distinct generated passwords. There are no default credentials. The bootstrap administrator is for Keycloak administration only, not an application account.

```bash
docker compose config --quiet
docker compose up --build -d
docker compose logs -f keycloak
```

Wait for the startup/import completion message. Open <http://localhost:8080/admin/> and sign in with your local bootstrap administrator credentials. The imported realm is `mozzarella`; its discovery document is <http://localhost:8080/realms/mozzarella/.well-known/openid-configuration>.

Compose builds Keycloak **26.8.0** and runs `start-dev --import-realm`. It connects to the official `postgres:17` image over the private Compose network and waits for PostgreSQL readiness. PostgreSQL data persists in the Compose-managed `keycloak-postgres` named volume. PostgreSQL has no published host port, and Keycloak binds only to host loopback at port 8080. Development mode and relaxed hostname checking are local-only, not production settings. PostgreSQL is pinned to major 17 and receives patch updates when pulled; Keycloak is pinned to the exact requested version.

To stop without deleting database state:

```bash
docker compose down
```

To completely reset this **local** environment:

```bash
docker compose down --volumes --remove-orphans
docker compose up --build -d
```

The reset permanently deletes this Compose project's Keycloak database, including realm edits, credentials, sessions, and administrator state. It does not affect Railway or Supabase. The fresh database is initialized using `.env`, then the realm is imported again. Changing PostgreSQL initialization credentials in `.env` does not change an existing database; use a deliberate database credential change or reset the disposable local environment. Bootstrap administrator variables likewise do not reset an existing administrator password.

## Realm configuration and import

`realm/mozzarella-realm.json` is the canonical, version-controlled baseline. Keycloak requires the filename to match the realm: `<realm>-realm.json`. If the JSON's `realm` value changes, rename its file too; a mismatch causes startup to fail. Compose mounts `realm/` read-only at `/opt/keycloak/data/import` and uses Keycloak's supported `--import-realm` startup option. The Dockerfile also includes the realm in the image for a future controlled Railway bootstrap.

On a fresh database, startup import creates the realm. **If `mozzarella` already exists, startup import skips it; restarting or rebuilding does not overwrite it.** JSON changes are not automatically synchronized to an existing realm. For disposable local development, use the complete reset above. Existing non-disposable environments need a reviewed update procedure and backups. Keycloak's offline `import --override` is destructive and requires all Keycloak instances to be stopped; do not use it casually against Railway. Do not commit raw realm exports, which may contain secrets or personal information.

The baseline includes:

- An enabled `mozzarella` realm with self-registration, email login, and password reset disabled.
- Brute-force protection enabled and the `VERIFY_PROFILE` required action disabled so direct-grant users are not blocked by profile setup.
- No user accounts or application permission tiers.
- An enabled confidential OIDC client named `nextjs`. Standard Authorization Code flow with PKCE S256 is enabled for a possible future reviewed flow, and Direct Access Grants support the current app-owned login form. Implicit flow and service accounts are disabled; full scope is disabled.
- Empty redirect URI and web origin lists. There are no invented application URLs or wildcard callbacks.
- No default or optional client scopes. The app explicitly requests `openid` for UserInfo; additional scopes are not requested.

Keycloak generates and stores a confidential client secret on import; no secret is supplied in Git. Configure the secret only as `KEYCLOAK_CLIENT_SECRET` in the ignored app `.env.local` and Vercel's server-only environment. Rotate any secret previously exposed during development and update both environments. The app uses Direct Access Grants, UserInfo, refresh grants, and the Keycloak logout endpoint. Access and refresh tokens are set only in `HttpOnly` cookies and are never exposed to browser JavaScript.

Future identities should be pseudonymous: use opaque identifiers and the OIDC `sub` for identity linkage rather than names or email addresses. The realm JSON does not contain accounts; the local setup command separately provisions its marked examples. Production identities and provisioning remain outside this scaffold. Application-specific student/class information belongs in the application database, not in realm JSON or Git.

The custom Class ID + User ID page is the only authentication UI outside Keycloak. Next.js sends the canonical identifier as both username and password over its server-side confidential-client request. Keycloak authenticates the user and manages access/refresh token expiry and logout. The verified `sub` maps to the app database, which owns class membership.

## Secrets

Local secrets live only in `Keycloak/.env`, already ignored by the repository's `.env*` rule; `.env.example` contains empty placeholders. Compose requires every local value rather than silently supplying a password. Do not print resolved Compose configuration or container environments into shared logs because they include secrets. Avoid real users and personal data in local fixtures. Never copy local credentials into Railway or Vercel.

The image copies the built Keycloak distribution and `realm/`; it does not copy `.env` or application files. Keep build contexts local/trusted and never upload secret-bearing context archives. Railway credentials belong in Railway's environment settings. Next.js secrets belong in Vercel's server-only configuration, never under `NEXT_PUBLIC_`.

## Future Railway connection

No Railway service is required for local development. When deploying later, create a Keycloak service with its root/build context set to `Keycloak/` and a separate PostgreSQL service. Use this Dockerfile's default command without an override; do not use the local Compose file as a production deployment definition. The image defaults to production `start --optimized --import-realm` and uses Railway's `PORT` for its HTTP listener, falling back to 8080 when unset. Its shell uses `exec` so shutdown signals reach Keycloak. Deployment requires service configuration and environment values, not source-code changes.

Set these environment variables on the Railway Keycloak service:

| Variable | Purpose |
| --- | --- |
| `KC_BOOTSTRAP_ADMIN_USERNAME` | Initial administrative username |
| `KC_BOOTSTRAP_ADMIN_PASSWORD` | Initial administrative password, supplied as a secret |
| `KC_DB` | `postgres`; must match the image's build-time database vendor |
| `KC_DB_URL` | JDBC URL for the dedicated Railway Keycloak PostgreSQL database |
| `KC_DB_USERNAME` | Dedicated Railway Keycloak database user |
| `KC_DB_PASSWORD` | Dedicated Railway Keycloak database password, supplied as a secret |
| `KC_HEALTH_ENABLED` | `true`; matches this image's build-time setting |
| `KC_METRICS_ENABLED` | `true`; matches this image's build-time setting |
| `KC_HTTP_ENABLED` | `true` when Railway terminates HTTPS |
| `KC_HOSTNAME` | Full public HTTPS URL of the Keycloak service, without `/realms/mozzarella` |
| `KC_HOSTNAME_STRICT` | `true` with the explicit public hostname |
| `KC_PROXY_HEADERS` | `xforwarded` when the trusted ingress supplies and overwrites `X-Forwarded-*` headers; verify the ingress behavior |
| `PORT` | HTTP listener port supplied/configured by Railway |

`KC_DB`, `KC_HEALTH_ENABLED`, and `KC_METRICS_ENABLED` already default to the values shown in the image; they need not be duplicated in Railway. They are build-time choices: changing them requires rebuilding the image, not merely setting different runtime values under `--optimized`.

Before production use, review the actual public HTTPS hostname and proxy behavior. Prefer an explicitly configured `KC_HOSTNAME` and strict hostname checking once the real domain is known; no production hostname is invented here. Trust forwarded headers only from a correctly configured proxy and protect administrative access. Health and metrics use the separate management port 9000; do not expose it publicly or point a main-port Railway health check at `/health/ready` without a deliberate management-interface arrangement.

The production command automatically imports the bundled canonical realm on a fresh database. On subsequent starts it skips an existing `mozzarella` realm, preserving accounts and configuration. This is initial provisioning, not automatic synchronization of later realm JSON edits. Do not reset or overwrite a deployed database to apply configuration changes. Establish backups and a reviewed configuration-update process, with adequate Keycloak memory allocation.

The application remains Next.js on Vercel, and its application database remains separate on Supabase. Set `KEYCLOAK_ISSUER` to the public Keycloak URL followed by `/realms/mozzarella`, `KEYCLOAK_CLIENT_ID` to `nextjs`, and `KEYCLOAK_CLIENT_SECRET` to the imported client's secret obtained from the Keycloak admin console. The issuer must exactly match the discovery document's issuer; never use the local `localhost` issuer in production. No application-code changes are needed to switch from local Keycloak to Railway. Apply the application's Prisma migrations before enabling login, and provision only pseudonymous users with a verified Keycloak subject and DB-owned class mapping. Account provisioning and the initial client-secret lookup remain administrative steps, not environment variables that automatically create users.

## References

- [Keycloak container builds and providers](https://www.keycloak.org/server/containers)
- [Keycloak realm import/export](https://www.keycloak.org/server/importExport)
- [Keycloak reverse proxy configuration](https://www.keycloak.org/server/reverseproxy)