import { z } from "zod";
import { createAgent, createTask, kickoff } from "@spider-adk/core";
import { webSearchTool, ToolRegistry } from "@spider-adk/tools";
import { LLMFactory } from "@spider-adk/llm";
import dotenv from "dotenv";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
dotenv.config();

async function run() {
  const r1 = readline.createInterface({ input, output });


  try {
    const providerType = await r1.question("which LLM provider do you want to use ?(openai/groq/gemini):");

    const roleInput = await r1.question("what is the agent's role?(e.g Research Assistant :");

    const agentRole = roleInput.trim() || "Research Assistant";

    const taskDescription = await r1.question("What task should the agent perform? ");


    const llm = LLMFactory.create(providerType);

    const registry = new ToolRegistry();
    registry.register(webSearchTool);


    // 3. Create the agent using user input
    const agent = createAgent({
      role: agentRole,
      goal: "Return a concise structured answer",
      backstory: "You work carefully and use tools when helpful.",
      // Map default models for the chosen provider
      model: providerType === "groq" ? "llama-3.1-8b-instant" : providerType === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini",
      temperature: 0.2,
      tools: ["web_search"]
    });


    const task = createTask({
      agent,
      description: taskDescription.trim() || "Explain what a TypeScript agent framework needs in one short JSON object.",
      retries: 1
    });
    console.log(`\nStarting task with ${providerType} as a ${agentRole}...\n`);


    const output = await kickoff({
      agent,
      task,
      llm,
      tools: registry
    });

    console.log("\n--- RESULT ---");
    // Just print the raw text instead of using JSON.stringify
    console.log(output);
  } finally {

    r1.close();
  }

}


run().catch(error => {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
});









