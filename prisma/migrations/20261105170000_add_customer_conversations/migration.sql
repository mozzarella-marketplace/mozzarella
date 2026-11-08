CREATE TYPE "ConversationRole" AS ENUM ('user', 'assistant');

CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "ConversationRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ConversationMessage_sessionId_createdAt_idx"
ON "ConversationMessage"("sessionId", "createdAt");
