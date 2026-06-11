import { z } from "zod";
import { createAgent } from "@agent-framework/core";
import { createTask, kickoff } from "@agent-framework/core";
import { webSearchTool, ToolRegistry } from "@agent-framework/tools";
import { OpenAIProvider } from "@agent-framework/llm";

async function run() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }

  const registry = new ToolRegistry();
  registry.register(webSearchTool);

  const agent = createAgent({
    role: "Research Assistant",
    goal: "Return a concise structured answer",
    backstory: "You work carefully and use tools when helpful.",
    model: "gpt-4o-mini",
    temperature: 0.2,
    tools: ["web_search"]
  });

  const task = createTask({
    agent,
    description: "Explain what a TypeScript agent framework needs in one short JSON object.",
    expectedOutput: '{ "title": string, "summary": string }',
    outputSchema: z.object({
      title: z.string(),
      summary: z.string()
    }),
    retries: 1
  });

  const llm = new OpenAIProvider(apiKey);

  const output = await kickoff({
    agent,
    task,
    llm,
    tools: registry
  });

  console.log(JSON.stringify(output, null, 2));
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});