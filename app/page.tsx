import type { FC } from "react";
import { UserStoryWorkspace } from "@/components/UserStoryWorkspace";
import { prisma } from "@/lib/db/prisma";

const sessionId = "example-session-id";

// The saved user story must be read on every request, not frozen into the page at build time.
export const dynamic = "force-dynamic";

const Index: FC = async () => {
  const userStory = await prisma.userStory.findUnique({
    where: { sessionId },
    select: { content: true },
  });

  return (
    <main className="flex min-h-screen items-start justify-center px-page-inline py-section">
      <UserStoryWorkspace
        sessionId={sessionId}
        savedContent={userStory?.content ?? null}
      />
    </main>
  );
};

export default Index;
