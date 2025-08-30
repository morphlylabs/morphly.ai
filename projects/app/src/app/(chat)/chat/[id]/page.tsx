import { Chat } from "../_components/chat";
import { convertToUIMessages } from "../../../../lib/utils";
import { getChat } from "../../actions";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

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
