# Keycloak infrastructure

This directory owns the Keycloak container, its dedicated database, and the canonical `mozzarella` realm configuration. It does not implement application authentication or provision student or teacher accounts.

## Architecture and ownership

The intended production architecture is:

```text
Browser -> Next.js / Vercel -> OIDC -> Keycloak / Railway
                                         |
                                         v
                              Keycloak PostgreSQL / Railway

Next.js / Vercel -> Application PostgreSQL / Supabase
```

Keycloak will own authentication, identity sessions, OIDC tokens, and identity roles. Next.js remains the application backend and security boundary, responsible for validating sessions/tokens and enforcing application authorization. No separate Express or Node backend is introduced.

Keycloak requires its own PostgreSQL database for its internal realms, credentials, sessions, clients, and configuration. The application database on Supabase will be the source of truth for application-specific student/class data. Never share the database, database user, connection URL, or credentials between these systems. Locally, Compose creates only Keycloak and its dedicated PostgreSQL service; it does not start or connect to Supabase or the application database.

## Local setup

Prerequisites: Docker with Docker Compose v2, a running Docker daemon, and port 8080 available. Run these commands from the repository root:

```bash
cd Keycloak
cp .env.example .env
```

Edit the ignored `.env` and fill all five variables. Choose a dedicated database name and user, a bootstrap administrator username, and distinct generated passwords. There are no default credentials. The bootstrap administrator is for Keycloak administration only, not a student or teacher account.

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
- Realm roles `student` and `teacher`. Neither role is automatically assigned, and no users are included.
- An enabled confidential OIDC client named `nextjs`, prepared for Authorization Code flow with PKCE S256. Direct access (password) grants are currently enabled; implicit flow and service accounts are disabled. Review password grants before production use; they do not implement the future custom browser authentication flow.
- Empty redirect URI and web origin lists. There are no invented application URLs or wildcard callbacks.
- Only the built-in `roles` client scope, limited to the student/teacher roles. Profile/email scopes are not requested by this client baseline.

Keycloak generates and stores a confidential client secret on import; no secret is supplied in Git. When authentication is explicitly implemented, set exact approved callback/origin URLs and manage the secret as a server-only Vercel environment variable. An enabled client does not mean the Next.js security boundary is implemented. No Next.js OIDC environment variables, routes, middleware, or callbacks are added here.

Future identities should be pseudonymous: use opaque identifiers and the OIDC `sub` for identity linkage rather than names or email addresses. This baseline does not create identities, configure provisioning, or implement a custom user profile. Application-specific student/class information belongs in the application database, not in realm JSON or Git.

## Future Class ID + User ID provider

Place a real, reviewed Keycloak 26.8.0-compatible provider JAR in `providers/` when that feature is implemented. The Dockerfile copies the directory before `kc.sh build`, so an empty directory containing only `.gitkeep` works now and future JARs are installed into `/opt/keycloak/providers`. Provider timestamps are normalized before the build to avoid optimized-start timestamp mismatches. Rebuild the image after adding or changing a JAR; do not mount providers into an already optimized production image.

No authenticator, custom flow, or nonexistent provider reference is configured now. Once the provider exists, add and test its executions, deliberately bind the resulting Class ID + User ID browser authentication flow, and review its security and identity-provisioning behavior. Class ID + User ID handling, profile requirements, and verification rules are future feature work, not an authentication bypass in this baseline.

## Secrets

Local secrets live only in `Keycloak/.env`, already ignored by the repository's `.env*` rule; `.env.example` contains empty placeholders. Compose requires every local value rather than silently supplying a password. Do not print resolved Compose configuration or container environments into shared logs because they include secrets. Avoid real users and personal data in local fixtures. Never copy local credentials into Railway or Vercel.

The image copies only `providers/`, the built Keycloak distribution, and `realm/`; it does not copy `.env` or application files. Keep build contexts local/trusted and never upload secret-bearing context archives. Railway credentials belong in Railway's environment settings. Future Next.js secrets belong in Vercel's server-only configuration, never under `NEXT_PUBLIC_`.

## Future Railway connection

Nothing in this setup deploys or changes the existing Railway service. When deliberately connecting this repository later, set that Railway service's root/build context to `Keycloak/` so it uses this Dockerfile. Do not use the local Compose file as a production deployment definition. The image defaults to production `start --optimized` and uses Railway's `PORT` for its HTTP listener, falling back to 8080 when unset. Its shell uses `exec` so shutdown signals reach Keycloak.

Preserve the existing Railway variable names:

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
| `KC_HTTP_ENABLED` | Enable internal HTTP when Railway terminates HTTPS |
| `KC_HOSTNAME_STRICT` | Existing hostname policy; review before production use |
| `KC_PROXY_HEADERS` | Forwarded-header mode matching Railway's trusted proxy configuration |
| `PORT` | HTTP listener port supplied/configured by Railway |

This does not rename, remove, or change any deployed variable. `KC_DB`, `KC_HEALTH_ENABLED`, and `KC_METRICS_ENABLED` are build-time choices: changing them requires rebuilding the image, not merely setting different runtime values under `--optimized`.

Before production use, review the actual public HTTPS hostname and proxy behavior. Prefer an explicitly configured `KC_HOSTNAME` and strict hostname checking once the real domain is known; no production hostname is invented here. Trust forwarded headers only from a correctly configured proxy and protect administrative access. Health and metrics use the separate management port 9000; do not expose it publicly or point a main-port Railway health check at `/health/ready` without a deliberate management-interface arrangement.

The production command does **not** automatically import a realm. For a deliberately approved fresh Railway bootstrap, add `--import-realm` to that command while preserving `--optimized` and the `PORT` listener; the image already contains the canonical realm. On an existing Railway database it will skip an existing `mozzarella` realm. Do not reset or overwrite the current Railway database to apply this scaffold. Establish a backup and reviewed configuration-update process first, with a separate dedicated PostgreSQL service and adequate Keycloak memory allocation.

The application remains Next.js on Vercel, and its application database remains separate on Supabase. No deployment, Vercel configuration, Supabase configuration, or application authentication is included.

## References

- [Keycloak container builds and providers](https://www.keycloak.org/server/containers)
- [Keycloak realm import/export](https://www.keycloak.org/server/importExport)
- [Keycloak reverse proxy configuration](https://www.keycloak.org/server/reverseproxy)