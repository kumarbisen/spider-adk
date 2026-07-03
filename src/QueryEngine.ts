import { ToolRegistry } from './tools';

// Interface for OpenAI, Anthropic, or local LLMs
export interface LLMProvider {
  query(prompt: string, context: any[], tools: ToolRegistry): Promise<any>;
}

export interface QueryEngineConfig {
  maxTurns: number;
  maxBudgetTokens: number;
  compactAfterTurns: number;
}

export interface UsageSummary {
  inputTokens: number;
  outputTokens: number;
}

export interface TurnResult {
  prompt: string;
  output: string;
  usage: UsageSummary;
  stopReason: string;
}

export class QueryEngine {
  private provider: LLMProvider;
  private tools: ToolRegistry;
  private config: QueryEngineConfig;
  
  public sessionId: string;
  private messages: any[] = [];
  private totalUsage: UsageSummary = { inputTokens: 0, outputTokens: 0 };

  constructor(provider: LLMProvider, tools: ToolRegistry, config?: Partial<QueryEngineConfig>) {
    this.provider = provider;
    this.tools = tools;
    this.config = {
      maxTurns: 8,
      maxBudgetTokens: 100000,
      compactAfterTurns: 12,
      ...config
    };
    this.sessionId = crypto.randomUUID();
  }

  async submitMessage(prompt: string): Promise<TurnResult> {
    if (this.messages.length >= this.config.maxTurns) {
      return { prompt, output: "Max turns reached.", usage: this.totalUsage, stopReason: 'max_turns_reached' };
    }

    const response = await this.provider.query(prompt, this.messages, this.tools);
    
    // Increment Token Tracking
    this.totalUsage.inputTokens += response.usage?.input_tokens || 0;
    this.totalUsage.outputTokens += response.usage?.output_tokens || 0;
    
    // Store Transcript
    this.messages.push({ role: 'user', content: prompt });
    this.messages.push({ role: 'assistant', content: response.content });

    this.compactMessagesIfNeeded();

    let stopReason = 'completed';
    if (this.totalUsage.inputTokens + this.totalUsage.outputTokens > this.config.maxBudgetTokens) {
      stopReason = 'max_budget_reached';
    }

    return {
      prompt,
      output: response.content,
      usage: this.totalUsage,
      stopReason
    };
  }

  private compactMessagesIfNeeded() {
    if (this.messages.length > this.config.compactAfterTurns * 2) {
      // Keep only the most recent N turns to avoid context overflow
      this.messages = this.messages.slice(-(this.config.compactAfterTurns * 2));
    }
  }
}
