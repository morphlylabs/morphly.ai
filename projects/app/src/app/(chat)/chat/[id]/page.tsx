import { Chat } from '../_components/chat';
import { convertToUIMessages } from '@/lib/utils';
import { getChat } from '@/app/(chat)/actions';

export default async function ChatPage(props: PageProps<'/chat/[id]'>) {
  const { id } = await props.params;

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
