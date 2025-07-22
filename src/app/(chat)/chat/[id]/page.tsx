import Model from "../../../../components/model";
import { getChat } from "../../actions";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const chat = await getChat(id);

  const mostRecentFile = chat.messages.at(-1)?.model[0]?.stl_file[0]?.url;

  return (
    <div className="grid h-screen grid-cols-4">
      <div className="col-span-3 h-full">
        {mostRecentFile && <Model src={mostRecentFile} />}
      </div>
      <div className="col-span-1 h-full">
        {chat.messages.map((message) => message.content)}
      </div>
    </div>
  );
}
