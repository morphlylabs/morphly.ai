import { Chat } from '../../../../components/chat';
import { convertToUIMessages } from '../../../../lib/utils';
import { getChat } from '../../actions';
import { auth } from '../../../../lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const chat = await getChat(id);

  const uiMessages = convertToUIMessages(chat.messages);

  return (
    <Chat
      id={chat.id}
      initialMessages={uiMessages}
      initialDocuments={chat.documents}
      autoResume={true}
    />
  );
}
