import { LLMProvider, QueryEngine } from '../QueryEngine';
import { ToolRegistry } from '../tools';
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private model: string;
  
  constructor(apiKey: string, model = 'claude-3-5-sonnet-20240620') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async query(prompt: string, context: any[], tools: ToolRegistry) {
    // Transform tool definitions to Anthropic's expected format
    const anthropicTools = tools.getProviderToolDefinitions().map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema
    }));

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [...context, { role: 'user', content: prompt }],
      tools: anthropicTools.length > 0 ? anthropicTools : undefined,
    });
    
    return {
      content: response.content.map(c => c.type === 'text' ? c.text : '').join('\n'),
      usage: response.usage
    };
  }
}
