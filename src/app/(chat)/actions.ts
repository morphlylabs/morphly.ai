"use server";

import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getChatById } from "~/server/db/queries";

export async function getChat(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const chat = await getChatById(id);

  if (!chat) {
    redirect("/chat");
  }

  return chat;
}
