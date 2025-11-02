import { Suspense } from 'react';
import { Chat } from '../_components/chat';
import { convertToUIMessages } from '@/lib/utils';
import { getChat } from '@/app/(chat)/actions';

export default function ChatPage(props: PageProps<'/chat/[id]'>) {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent params={props.params} />
    </Suspense>
  );
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chat = await getChat(id);
  const uiMessages = convertToUIMessages(chat.messages);

  return (
    <Chat
      chatId={chat.id}
      initialMessages={uiMessages}
      initialDocuments={chat.documents}
      autoResume={true}
    />
  );
}
