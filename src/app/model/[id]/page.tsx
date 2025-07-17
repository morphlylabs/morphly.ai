import Model from "~/components/model";
import { notFound } from "next/navigation";
import { getModel } from "../../../actions/model.action";

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

  return <Model src={model.url} />;
}
