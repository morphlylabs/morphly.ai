import { Chat } from './_components/chat';
import { v4 } from 'uuid';

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const id = v4();

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      initialDocuments={[]}
      autoResume={false}
    />
  );
}
