import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z

    .enum(["development", "test", "production"])

    .default("development"),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
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
