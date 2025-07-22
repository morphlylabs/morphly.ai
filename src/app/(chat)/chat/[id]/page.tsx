import { getChat } from "../../actions";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const chat = await getChat(id);

  return <div>{chat.messages.map((message) => message.content)}</div>;
}
