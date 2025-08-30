import { LambdaClient } from "@aws-sdk/client-lambda";
import { env } from "@/env";

let _client: LambdaClient | null = null;

export function getLambdaClient(): LambdaClient {
  if (_client) return _client;

  const region = env.AWS_REGION;

  _client = new LambdaClient({
    region,
  });

  return _client;
}
