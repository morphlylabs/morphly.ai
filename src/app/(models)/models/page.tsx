import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { getModels } from "../actions";
import ModelPreview from "../../../components/model-preview";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default async function ModelsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const models = await getModels(session.user.id);

  return (
    <div className="space-y-4 p-4">
      <Button asChild>
        <Link href="/prompt">+ Create Model</Link>
      </Button>
      <div className="flex flex-col gap-4">
        {models.map((model) => (
          <ModelPreview
            key={model.id}
            id={model.id}
            name={model.name}
            updatedAt={model.updatedAt ?? model.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
