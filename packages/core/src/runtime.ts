import {z} from 'zod';
import type {Agent, LLMRequest, LLMResponse, Task, LLMProvider} from "./types.js"
import {ToolRegistry} from "@spider-adk/tools";


// creates a scheme that accepts anything
const defaultOutputSchema = z.unknown();

function buildSystemPrompt(agent:Agent ,task:Task):string{
  // array of prompt section

  const parts = [
    `You are ${agent.role}.`,
    `Goal: ${agent.goal}.`,
    agent.backstory ? `Backstory: ${agent.backstory}` : "",
    task.expectedOutput ? `Expected output: ${task.expectedOutput}` : ""
  ];
  // remove empty strings and combines
  return parts.filter(Boolean).join("\n");
}


function buildUserPrompt(task:Task):string{
  return task.description;
}

export async function kickoff<TOutput = unknown>(input:{
  agent: Agent;
  task: Task<TOutput>;
  llm: LLMProvider;
  tools?: ToolRegistry;
}): Promise<TOutput> {
  const  {agent, task , llm , tools} = input;
  const messages:LLMRequest ["messages"] = [
    { role: "system", content: buildSystemPrompt(agent, task) },
    { role: "user", content: buildUserPrompt(task) }

  ];


  const response:LLMResponse = await llm.chat({
    messages,
    model:agent.model,
    temperature:agent.temperature,
    responseSchema: task.outputSchema,
    tools: tools?.list().map(tool => ({
      name:tool.name,
      description: tool.description,
      schema:tool.schema

    }))
  })

  let parsed: unknown = response.content;

  if (task.outputSchema){
    // use task.outputschema if exist else if undefined or null use defaultoutputschema
    const schema = task.outputSchema ?? defaultOutputSchema;
    const candidate =
      typeof response.content === "string"
      ? safeJsonParse(response.content) : response.content

    parsed = schema.parse(candidate);

  }

  return parsed as TOutput;
}

/** Fallback parser for providers that don't support native structured output. */
function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    try {
      const match = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        return JSON.parse(match[1]);
      }
    } catch {
      // ignore
    }
    return value;
  }
}