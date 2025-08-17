import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { headers } from 'next/headers';
import { db } from '~/server/db';
import { nextCookies } from 'better-auth/next-js';
import { env } from '~/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // Optional: Always ask to select account
      prompt: 'select_account',
      // Optional: Always get refresh token
      accessType: 'offline',
    },
  },
  plugins: [nextCookies()],
});

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
