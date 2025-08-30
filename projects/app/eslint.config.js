import baseConfig, { restrictEnvAccess } from "@workspace/eslint-config/base";
import nextjsConfig from "@workspace/eslint-config/next";
import reactConfig from "@workspace/eslint-config/react";
import drizzleConfig from "@workspace/eslint-config/drizzle";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...drizzleConfig,
  ...restrictEnvAccess,
];
