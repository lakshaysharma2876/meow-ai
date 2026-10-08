import { openaiClient, openrouterClient } from "./clients";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export type LLMTask = "summary" | "chat";

export interface GenerateCompletionOptions {
  task: LLMTask;
  messages: ChatCompletionMessageParam[];
  preferredModel?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  provider: "openrouter" | "openai";
  model: string;
}

const TASK_MODEL_CONFIGS: Record<
  LLMTask,
  {
    openrouterModel: string;
    openaiFallback: string;
  }
> = {
  summary: {
    openrouterModel: "google/gemini-2.0-flash-exp:free",
    openaiFallback: "gpt-4o",
  },
  chat: {
    openrouterModel: "meta-llama/llama-3.3-70b-instruct:free",
    openaiFallback: "gpt-4o",
  },
};

export async function generateCompletion(options: GenerateCompletionOptions): Promise<LLMResponse> {
  const { task, messages, preferredModel, temperature = 0.7, maxTokens } = options;
  const config = TASK_MODEL_CONFIGS[task];

  const targetOpenRouterModel = preferredModel || config.openrouterModel;

  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log(`[LLMRouter] Attempting OpenRouter with model: ${targetOpenRouterModel}`);
      const response = await openrouterClient.chat.completions.create({
        model: targetOpenRouterModel,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        console.log(`[LLMRouter] Success via OpenRouter (${targetOpenRouterModel})`);
        return {
          content,
          provider: "openrouter",
          model: targetOpenRouterModel,
        };
      }
    } catch (openRouterErr) {
      console.warn("[LLMRouter] OpenRouter failed, falling back to OpenAI:", openRouterErr);
    }
  }

  console.log(`[LLMRouter] Routing to OpenAI fallback model: ${config.openaiFallback}`);
  const fallbackResponse = await openaiClient.chat.completions.create({
    model: config.openaiFallback,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const content = fallbackResponse.choices[0]?.message?.content || "";
  return {
    content,
    provider: "openai",
    model: config.openaiFallback,
  };
}
