import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { z } from "zod";
import { logger } from "../lib/logging/logger";

class SetupError extends Error {}

const issuer = "http://localhost:8080/realms/mozzarella";
const realmUrl = "http://localhost:8080/admin/realms/mozzarella";
const fixtureMarker = "mozzarella-local-example";
const examples = [
  { classId: "B001", userId: "1001" },
  { classId: "B001", userId: "1002" },
  { classId: "B001", userId: "1003" },
  { classId: "B002", userId: "2001" },
  { classId: "B002", userId: "2002" },
];

const runCommand = async (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "ignore",
      shell: process.platform === "win32" && command === "npm",
    });
    child.once("error", () =>
      reject(new SetupError(`Could not start ${command}`)),
    );
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(
            new SetupError(`${command} failed; check local configuration`),
          ),
    );
  });

const request = async (url: string, options?: RequestInit) => {
  try {
    return await fetch(url, {
      ...options,
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new SetupError("Local Keycloak request failed");
  }
};

const readJson = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    throw new SetupError(
      `Local Keycloak request returned HTTP ${response.status}`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new SetupError("Local Keycloak returned invalid JSON");
  }
};

const waitForRealm = async () => {
  for (let attempt = 0; attempt < 90; attempt++) {
    let response: Response | undefined;

    try {
      response = await request(`${issuer}/.well-known/openid-configuration`);
    } catch {
      // Compose may still be starting or importing the realm.
    }

    if (response?.ok) {
      const discovery = z.object({ issuer: z.literal(issuer) });
      discovery.parse(await readJson(response));
      return;
    }

    if (response && response.status !== 404 && response.status < 500) {
      throw new SetupError(
        "Local realm discovery failed; check Keycloak configuration",
      );
    }

    await delay(2_000);
  }

  throw new SetupError(
    "Local Keycloak did not become ready; check Compose logs",
  );
};

const saveAppConfiguration = async (secret: string) => {
  const path = ".env.local";
  let content = existsSync(path) ? await readFile(path, "utf8") : "";
  const values = {
    KEYCLOAK_ISSUER: issuer,
    KEYCLOAK_CLIENT_ID: "nextjs",
    KEYCLOAK_CLIENT_SECRET: secret,
  };

  for (const [name, value] of Object.entries(values)) {
    const assignment = `${name}=${JSON.stringify(value)}`;
    const pattern = new RegExp(`^(?:export\\s+)?${name}\\s*=.*$`, "gm");
    content = pattern.test(content)
      ? content.replace(pattern, () => assignment)
      : `${content}${content.endsWith("\n") || !content ? "" : "\n"}${assignment}\n`;
  }

  await writeFile(path, content, { mode: 0o600 });
};

const setup = async () => {
  for (const path of [".env.local", ".env"]) {
    if (existsSync(path)) {
      process.loadEnvFile(path);
    }
  }

  const { env } = await import("../lib/config/env");

  if (
    env.NODE_ENV !== "development" ||
    (env.KEYCLOAK_ISSUER && env.KEYCLOAK_ISSUER !== issuer) ||
    (env.KEYCLOAK_CLIENT_ID && env.KEYCLOAK_CLIENT_ID !== "nextjs")
  ) {
    throw new SetupError(
      "Setup only supports development with the local mozzarella realm and nextjs client",
    );
  }

  if (!existsSync("Keycloak/.env")) {
    throw new SetupError(
      "Copy Keycloak/.env.example to Keycloak/.env and fill all eight values first",
    );
  }

  const composeEnvironment = z
    .object({
      KC_BOOTSTRAP_ADMIN_USERNAME: z.string().min(1),
      KC_BOOTSTRAP_ADMIN_PASSWORD: z.string().min(1),
      POSTGRES_DB: z.string().min(1),
      POSTGRES_USER: z.string().min(1),
      POSTGRES_PASSWORD: z.string().min(1),
      APP_POSTGRES_DB: z.string().min(1),
      APP_POSTGRES_USER: z.string().min(1),
      APP_POSTGRES_PASSWORD: z.string().min(1),
    })
    .safeParse(parseEnv(await readFile("Keycloak/.env", "utf8")));

  if (!composeEnvironment.success) {
    throw new SetupError("Fill all eight required values in Keycloak/.env");
  }

  logger.info("Starting local containers and importing the realm if absent");
  await runCommand("docker", [
    "compose",
    "--project-directory",
    "Keycloak",
    "config",
    "--quiet",
  ]);
  await runCommand("docker", [
    "compose",
    "--project-directory",
    "Keycloak",
    "up",
    "--build",
    "-d",
    "--wait",
    "--wait-timeout",
    "120",
  ]);
  await waitForRealm();

  const adminToken = z.object({ access_token: z.string().min(1) }).parse(
    await readJson(
      await request(
        "http://localhost:8080/realms/master/protocol/openid-connect/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: "admin-cli",
            grant_type: "password",
            username: composeEnvironment.data.KC_BOOTSTRAP_ADMIN_USERNAME,
            password: composeEnvironment.data.KC_BOOTSTRAP_ADMIN_PASSWORD,
          }),
        },
      ),
    ),
  ).access_token;

  const adminRequest = (path: string, options?: RequestInit) =>
    request(`${realmUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });

  const clients = z
    .array(z.object({ id: z.string().min(1), clientId: z.literal("nextjs") }))
    .parse(await readJson(await adminRequest("/clients?clientId=nextjs")));

  if (clients.length !== 1) {
    throw new SetupError(
      "Expected exactly one nextjs client in the local realm",
    );
  }

  const secret = z
    .object({ value: z.string().min(1) })
    .parse(
      await readJson(
        await adminRequest(
          `/clients/${encodeURIComponent(clients[0].id)}/client-secret`,
        ),
      ),
    ).value;
  const profile = z
    .object({
      attributes: z.array(z.object({ name: z.string() }).passthrough()),
    })
    .passthrough()
    .parse(await readJson(await adminRequest("/users/profile")));

  if (
    !profile.attributes.some((attribute) => attribute.name === "localFixture")
  ) {
    profile.attributes.push({
      name: "localFixture",
      multivalued: true,
      permissions: { view: ["admin"], edit: ["admin"] },
    });
    const updated = await adminRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });

    if (!updated.ok) {
      throw new SetupError(
        `Local fixture attribute configuration failed with HTTP ${updated.status}`,
      );
    }
  }

  logger.info("Applying application database migrations");
  await runCommand("npm", ["run", "db:deploy"]);
  logger.info("Seeding marketplace customers");
  await runCommand("npm", ["run", "db:seed"]);
  const { prisma } = await import("../lib/db/prisma");

  try {
    const userSchema = z.object({
      id: z.string().min(1),
      username: z.string(),
      enabled: z.boolean(),
      attributes: z.object({ localFixture: z.array(z.string()) }).optional(),
    });
    const mappings: {
      classId: string;
      userId: string;
      keycloakUserId: string;
    }[] = [];

    for (const example of examples) {
      const username = `${example.classId}-${example.userId}`;
      const query = new URLSearchParams({ username, exact: "true" });
      let users = z
        .array(userSchema)
        .parse(await readJson(await adminRequest(`/users?${query}`)));

      if (users.length === 0) {
        const existingMapping = await prisma.user.findUnique({
          where: { classId_userId: example },
        });

        if (existingMapping) {
          throw new SetupError(
            "Example database mapping exists without its Keycloak account; resolve it manually",
          );
        }

        const created = await adminRequest("/users", {
          method: "POST",
          body: JSON.stringify({
            username,
            enabled: true,
            attributes: { localFixture: [fixtureMarker] },
            credentials: [
              { type: "password", value: username, temporary: false },
            ],
          }),
        });

        if (created.status !== 201) {
          throw new SetupError(
            `Example account creation failed with HTTP ${created.status}`,
          );
        }

        users = z
          .array(userSchema)
          .parse(await readJson(await adminRequest(`/users?${query}`)));
      }

      if (
        users.length !== 1 ||
        users[0].username.toUpperCase() !== username ||
        !users[0].enabled ||
        !users[0].attributes?.localFixture.includes(fixtureMarker)
      ) {
        throw new SetupError(
          "Example username conflicts with an existing or disabled account; resolve it manually",
        );
      }

      const keycloakUserId = users[0].id;
      const existingMapping = await prisma.user.findFirst({
        where: {
          OR: [
            { classId: example.classId, userId: example.userId },
            { keycloakUserId },
          ],
        },
      });

      if (
        existingMapping &&
        (existingMapping.keycloakUserId !== keycloakUserId ||
          existingMapping.classId !== example.classId ||
          existingMapping.userId !== example.userId)
      ) {
        throw new SetupError(
          "Example account conflicts with an application mapping; resolve it manually",
        );
      }

      mappings.push({ ...example, keycloakUserId });
    }

    await prisma.$transaction(async (transaction) => {
      for (const classId of ["B001", "B002"]) {
        await transaction.class.upsert({
          where: { classId },
          create: { classId },
          update: {},
        });
      }

      for (const mapping of mappings) {
        await transaction.user.upsert({
          where: { keycloakUserId: mapping.keycloakUserId },
          create: mapping,
          update: {},
        });
      }
    });

    await saveAppConfiguration(secret);
    logger.info(
      "Local setup complete: two example classes and five students; restart the app to load its local configuration",
    );
  } finally {
    await prisma.$disconnect();
  }
};

setup().catch((error: unknown) => {
  logger.error(
    error instanceof SetupError
      ? error.message
      : "Local Keycloak setup failed. Check local configuration and database availability; external error details are omitted.",
  );
  process.exitCode = 1;
});
