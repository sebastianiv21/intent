import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { categories, user, session, account, verification } from "./schema";
import { DEFAULT_CATEGORIES } from "./seed-data";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
      allowDifferentEmails: false,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // Seed default categories for new user
            const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
              ...cat,
              userId: user.id,
            }));
            await db.insert(categories).values(categoriesToInsert);
          } catch (error) {
            console.error("Failed to seed default categories:", error);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
