import type { FC } from "react";
import { UserStoryWorkspace } from "@/components/UserStoryWorkspace";

const Index: FC = () => (
  <main className="flex min-h-screen items-start justify-center px-page-inline py-section">
    <UserStoryWorkspace sessionId="example-session-id" />
  </main>
);

export default Index;
