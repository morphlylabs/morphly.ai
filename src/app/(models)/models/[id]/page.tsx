import Model from "~/components/model";
import { notFound, redirect } from "next/navigation";
import { getModel } from "../../actions";
import { auth } from "../../../../lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModelPage({ params }: Props) {
  const { id } = await params;
  if (Number.isNaN(Number(id))) {
    return notFound();
  }

  const model = await getModel(Number(id));
  if (!model) {
    return notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.id !== model.userId) {
    return notFound();
  }

  return <Model src={model.url} />;
}
