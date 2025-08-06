import { z } from "zod";

export const postRequestBodySchema = z.object({
  code: z.string().min(1, "CadQuery code cannot be empty"),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
