import type { Task as TaskType, TaskConfig } from "./types.js";

let taskCounter = 0;

export function createTask<TOutput = unknown>(config: TaskConfig<TOutput>): TaskType<TOutput> {
  taskCounter += 1;

  return {
    id: `task_${taskCounter}`,
    description: config.description,
    expectedOutput: config.expectedOutput,
    outputSchema: config.outputSchema,
    agentId: config.agent?.id,
    tools: config.tools,
    retries: config.retries ?? 0
  };
}