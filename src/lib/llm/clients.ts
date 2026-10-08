import OpenAI from "openai";

// Direct OpenAI Client
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// OpenRouter Client (OpenAI-compatible)
export const openrouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://meow-ai-lemon.vercel.app",
    "X-Title": "Meow AI Platform",
  },
});
