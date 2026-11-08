-- The customer cleanup dropped this enum; the user-story branch still needs it.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProgrammingLanguage') THEN
        CREATE TYPE "ProgrammingLanguage" AS ENUM ('java', 'csharp');
    END IF;
END $$;
