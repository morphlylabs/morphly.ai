import { Chat } from './_components/chat';
import { v4 } from 'uuid';
import { Suspense } from 'react';
import { connection } from 'next/server';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}

async function ChatContent() {
  await connection();
  const chatId = v4();

  return (
    <Chat
      chatId={chatId}
      initialMessages={[]}
      initialDocuments={[]}
      autoResume={false}
    />
  );
}
