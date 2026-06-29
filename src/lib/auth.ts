import { betterAuth } from "better-auth";
import { Pool } from "pg";

const database = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const auth = betterAuth({
  database: database,
  //set for vercel
  baseURL: "https://meow-ai-lemon.vercel.app/",

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  },
});
