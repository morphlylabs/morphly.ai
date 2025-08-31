import 'server-only';

import { getLambdaClient } from './lambda-client';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { z } from 'zod';
import { env } from '@/env';

const cadQuerySuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  headers: z.record(z.string(), z.string()),
  body: z.object({
    stl_url: z.string().url(),
    svg_url: z.string().url(),
    stp_url: z.string().url(),
  }),
});

const cadQueryErrorResponseSchema = z.object({
  statusCode: z.union([z.literal(400), z.literal(404), z.literal(500)]),
  headers: z.record(z.string(), z.string()),
  body: z.object({
    error: z.string(),
    detail: z.string().optional(),
    trace: z.string().optional(),
  }),
});

export const cadQueryResponseSchema = z.union([
  cadQuerySuccessResponseSchema,
  cadQueryErrorResponseSchema,
]);

export type CadQueryResponse = z.infer<typeof cadQuerySuccessResponseSchema>;

export async function executeCadQuery(code: string): Promise<CadQueryResponse> {
  const client = getLambdaClient();

  const command = new InvokeCommand({
    FunctionName: env.AWS_LAMBDA_CQTOSTL_FUNCTION_NAME,
    Payload: JSON.stringify({ body: code }),
  });

  try {
    const response = await client.send(command);
    if (!response.Payload) {
      throw new Error('Lambda function returned no payload');
    }

    const payloadString = new TextDecoder().decode(response.Payload);

    const responseBody = cadQueryResponseSchema.parse(
      JSON.parse(payloadString),
    );

    if (responseBody.statusCode !== 200) {
      console.error(
        responseBody.body.error,
        responseBody.body.detail,
        responseBody.body.trace,
      );
      throw new Error(
        `Lambda function failed with status ${responseBody.statusCode}`,
      );
    }

    return responseBody;
  } catch (error) {
    console.error('executeCadQuery failed', error);
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid Lambda response format: ${error.message}`);
    }
    throw error;
  }
}
