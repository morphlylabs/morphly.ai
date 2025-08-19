import { Chat } from '~/components/chat';
import { v4 } from 'uuid';

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
