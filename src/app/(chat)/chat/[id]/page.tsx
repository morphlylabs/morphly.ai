import { Chat } from "../../../../components/chat";
import { DataStreamHandler } from "../../../../components/data-stream-handler";
import Model from "../../../../components/model";
import { convertToUIMessages } from "../../../../lib/utils";
import { getChat } from "../../actions";
import { auth } from "../../../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const chat = await getChat(id);

  let fileToDisplay: string | undefined = undefined;

  for (let i = chat.messages.length - 1; i >= 0; i--) {
    const message = chat.messages.at(i);
    if (message?.models && message.models.length > 0) {
      fileToDisplay = message.models.at(0)?.stl_file.at(0)?.url;
      break;
    }
  }

  console.log(chat.messages);

  const uiMessages = convertToUIMessages(chat.messages);

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-4">
      <div className="col-span-3 h-full">
        {fileToDisplay && <Model src={fileToDisplay} />}
      </div>
      <div className="col-span-1 h-full">
        <Chat id={chat.id} initialMessages={uiMessages} autoResume={true} />
        <DataStreamHandler />
      </div>
    </div>
  );
}
