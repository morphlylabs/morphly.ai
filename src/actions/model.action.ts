"use server";

import { db } from "~/server/db";
import { models } from "~/server/db/schema";

export const getModel = async (id: number) => {
  const model = await db.query.models.findFirst({
    where: (models, { eq }) => eq(models.id, id),
  });

  return model;
};

export const addModel = async (name: string, url: string) => {
  await db.insert(models).values({ name, url });
};
