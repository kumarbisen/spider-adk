import type { Agent as AgentType, AgentConfig } from "./types.js";

let agentCounter = 0;

export function createAgent(config: AgentConfig): AgentType {
  agentCounter += 1;

  return {
    id: `agent_${agentCounter}`,
    role: config.role,
    goal: config.goal,
    backstory: config.backstory,
    tools: config.tools,
    model: config.model,
    temperature: config.temperature
  };
}