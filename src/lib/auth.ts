import { db } from '@/db/drizzle';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  appName: 'tkiara',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  advanced: {
    generateId: false,
    cookiePrefix: 'tkiara',
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
    fields: {
      userId: 'userId',
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    nextCookies(),
  ],
});
