import { auth } from '~/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Chat } from '../../../components/chat';
import { v4 } from 'uuid';

export default async function ChatPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

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
