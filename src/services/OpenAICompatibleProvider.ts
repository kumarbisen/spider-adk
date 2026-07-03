import OpenAI from 'openai';
import { LLMProvider } from '../QueryEngine';
import { ToolRegistry } from '../tools';

export interface OpenAICompatibleProviderConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

export class OpenAICompatibleProvider implements LLMProvider {
  protected client: OpenAI;
  protected model: string;

  constructor(config: OpenAICompatibleProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL
    });
    this.model = config.model;
  }

  async query(prompt: string, context: any[], tools: ToolRegistry) {
    const providerTools = tools.getProviderToolDefinitions().map((t) => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema
      }
    }));

    const messages = [...context, { role: 'user', content: prompt }];

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      tools: providerTools.length > 0 ? providerTools : undefined,
      tool_choice: providerTools.length > 0 ? 'auto' : undefined
    });

    const choice = response.choices[0];
    const content = typeof choice?.message?.content === 'string' ? choice.message.content : '';

    return {
      content,
      usage: {
        input_tokens: response.usage?.prompt_tokens ?? 0,
        output_tokens: response.usage?.completion_tokens ?? 0
      }
    };
  }
}