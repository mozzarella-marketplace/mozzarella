-- Keep existing customer records valid while adding authoritative scenario details.
ALTER TABLE "customers" ADD COLUMN "problem_brief" JSONB;
