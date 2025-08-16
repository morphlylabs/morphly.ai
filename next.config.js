/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

const isProduction = process.env.NODE_ENV === 'production';
const isPlaywright = process.env.PLAYWRIGHT;

/** @type {import("next").NextConfig} */
const config = {
  compiler: {
    // Remove data-testid in production builds, but keep them for Playwright tests
    reactRemoveProperties: isProduction &&
      !isPlaywright && { properties: ['^data-testid$'] },
  },
};

export default config;
