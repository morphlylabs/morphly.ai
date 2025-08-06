import { getLambdaClient } from "./lambda-client";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { z } from "zod";
import { env } from "~/env";

const cadQueryResponseSchema = z.object({
  statusCode: z.number(),
  headers: z.record(z.string(), z.string()),
  body: z.string().min(1, "STL data cannot be empty"),
  isBase64Encoded: z.boolean(),
});

export type CadQueryResponse = z.infer<typeof cadQueryResponseSchema>;

export async function executeCadQuery(code: string): Promise<string> {
  const client = getLambdaClient();

  const command = new InvokeCommand({
    FunctionName: env.AWS_LAMBDA_CQTOSTL_FUNCTION_NAME,
    Payload: JSON.stringify({ body: code }),
  });

  try {
    const response = await client.send(command);

    if (!response.Payload) {
      throw new Error("Lambda function returned no payload");
    }

    const payloadString = new TextDecoder().decode(response.Payload);
    console.log(payloadString);

    const responseBody = cadQueryResponseSchema.parse(
      JSON.parse(payloadString),
    );

    return responseBody.body;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid Lambda response format: ${error.message}`);
    }
    throw error;
  }
}
