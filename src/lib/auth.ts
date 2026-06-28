import { betterAuth } from "better-auth";
import { Pool } from "pg";

const database = new Pool({
  connectionString:"postgresql://postgres:ZxzFoWpnxYaVtrxC@db.uvyeymmqrxztjbyzevwt.supabase.co:5432/postgres",
});

export const auth = betterAuth({
  database: database,
  //set for vercel
  baseURL: "http://localhost:3000/",
});
