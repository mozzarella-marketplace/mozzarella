import { config } from "dotenv";

// Populates process.env before lib/config/env.ts is imported; Next.js loads .env itself, so this only matters for non-Next entrypoints like prisma.config.ts.
config({ path: [".env.local", ".env"] });
