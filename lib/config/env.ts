import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z

    .enum(["development", "test", "production"])

    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  KEYCLOAK_ISSUER: z
    .string()
    .url()
    .refine((issuer) => ["http:", "https:"].includes(new URL(issuer).protocol))
    .optional(),
  KEYCLOAK_CLIENT_ID: z.string().min(1).optional(),
  KEYCLOAK_CLIENT_SECRET: z.string().min(1).optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

function parseEnvironment(): Environment {
  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.message}`,
    );
  }

  return result.data;
}

export const env = parseEnvironment();
