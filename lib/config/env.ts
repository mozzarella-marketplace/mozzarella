import { z } from "zod";

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

const environmentSchema = z
  .object({
    NODE_ENV: z

      .enum(["development", "test", "production"])

      .default("development"),
    DATABASE_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    KEYCLOAK_ISSUER: z
      .string()
      .url()
      .refine((issuer) =>
        ["http:", "https:"].includes(new URL(issuer).protocol),
      )
      .optional(),
    KEYCLOAK_CLIENT_ID: z.string().min(1).optional(),
    KEYCLOAK_CLIENT_SECRET: z.string().min(1).optional(),
  })
  .superRefine((configuration, context) => {
    if (
      configuration.NODE_ENV !== "production" ||
      isProductionBuild ||
      !configuration.KEYCLOAK_ISSUER
    ) {
      return;
    }

    const issuer = new URL(configuration.KEYCLOAK_ISSUER);
    const localHostnames = ["localhost", "127.0.0.1", "[::1]"];

    if (
      issuer.protocol !== "https:" ||
      localHostnames.some(
        (hostname) =>
          issuer.hostname === hostname ||
          issuer.hostname.endsWith(`.${hostname}`),
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["KEYCLOAK_ISSUER"],
        message: "Production Keycloak issuer must use a public HTTPS hostname",
      });
    }
  });

export type Environment = z.infer<typeof environmentSchema>;

const parseEnvironment = (): Environment => {
  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.message}`,
    );
  }

  return result.data;
};

export const env = parseEnvironment();
