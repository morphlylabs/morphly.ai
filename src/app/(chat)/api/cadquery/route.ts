import { z } from "zod";
import { auth } from "~/lib/auth";
import { executeCadQuery } from "~/server/aws/lambda";
import { postRequestBodySchema, type PostRequestBody } from "./schema";

export const maxDuration = 30;

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    requestBody = postRequestBodySchema.parse(await request.json());
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
        detail: error instanceof z.ZodError ? error.message : "Bad request",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { code } = requestBody;

    const result = await executeCadQuery(code);

    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CadQuery execution error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(
      JSON.stringify({
        error: "CadQuery execution failed",
        detail: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
