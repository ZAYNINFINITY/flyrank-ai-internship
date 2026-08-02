import { ChatPanel } from "@/components/ai/chat-panel";
import { ErrorBoundary } from "@/components/ai/error-boundary";

export default function AssistantPage() {
  return (
    <ErrorBoundary>
      <ChatPanel heading="Assistant" subtitle="AI interaction engine" />
    </ErrorBoundary>
  );
}
