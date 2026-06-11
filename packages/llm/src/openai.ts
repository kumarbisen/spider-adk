import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { LLMProvider } from "./provider.js";
import type { LLMRequest, LLMResponse } from "@agent-framework/core";

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: request.model ?? "gpt-4o-mini",
      ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
      ...(request.responseSchema
        ? { response_format: zodResponseFormat(request.responseSchema, "output") }
        : {}),
      messages: request.messages.map((message: any) => ({
        role: message.role,
        content: message.content
      }))
    });

    const content = response.choices[0]?.message?.content ?? "";

    return { content };
  }
}