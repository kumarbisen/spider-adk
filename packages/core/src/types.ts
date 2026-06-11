import type { ZodTypeAny } from "zod";

export type Role = string;

export interface AgentConfig {
  role: string;
  goal: string;
  backstory?: string;
  tools?: string[];
  model?: string;
  temperature?: number;
}

export interface TaskConfig<TOutput = unknown> {
  description: string;
  expectedOutput?: string;
  outputSchema?: ZodTypeAny;
  agent?: Agent;
  tools?: string[];
  retries?: number;
}

export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
}

export interface ToolCall {
  name: string;
  arguments: unknown;
}

export interface ToolResult {
  name: string;
  content: string;
}

export interface LLMResponse {
  content: string;
  toolCalls?: ToolCall[];
}

export interface LLMProvider {
  chat(request: LLMRequest): Promise<LLMResponse>;
}

export interface LLMRequest {
  messages: Message[];
  model?: string | undefined;
  temperature?: number | undefined;
  tools?: ToolDefinition[] | undefined;
  responseSchema?: ZodTypeAny | undefined;
}

export interface ToolDefinition {
  name: string;
  description: string;
  schema: ZodTypeAny | Record<string, unknown>;
}

export interface Agent {
  id: string;
  role: string;
  goal: string;
  backstory?: string | undefined;
  tools?: string[] | undefined;
  model?: string | undefined;
  temperature?: number | undefined;
}

export interface Task<TOutput = unknown> {
  id: string;
  description: string;
  expectedOutput?: string | undefined;
  outputSchema?: ZodTypeAny | undefined;
  agentId?: string | undefined;
  tools?: string[] | undefined;
  retries: number;
}

export interface Crew {
  id: string;
  agents: Agent[];
  tasks: Task[];
}

export interface FlowState {
  [key: string]: unknown;
}