# 🤖 Spider ADK

> **The open-source, TypeScript-native alternative to CrewAI.**

Spider ADK is a powerful, modular, and fully typed framework for building, orchestrating, and managing autonomous AI agents. Designed specifically for the TypeScript ecosystem, it brings the concepts of role-based AI collaboration (Agents, Tasks, Crews) into a robust, scalable architecture.

---

## ✨ Features

- **TypeScript Native**: Full end-to-end type safety, eliminating runtime guesswork. Zod schemas are treated as first-class citizens for structured data extraction.
- **Role-Based Orchestration**: Design agents with distinct roles, goals, and backstories to achieve complex multi-step workflows.
- **Modular Monorepo Architecture**: Cleanly decoupled packages. Swap out memory stores, LLM providers, and tools effortlessly.
- **Bring Your Own LLM (BYO-LLM)**: Easy-to-implement Provider interface. Defaults to OpenAI, but extendable to any provider.
- **Tool Registry**: Easily equip your agents with custom tools.

## 🏗️ Architecture

Spider ADK is structured as a `pnpm` workspace containing multiple standalone packages:

- **`@spider-adk/core`**: The orchestration engine. Contains definitions and runtimes for Agents, Tasks, and Flows.
- **`@spider-adk/llm`**: LLM provider integrations (e.g., OpenAI). 
- **`@spider-adk/tools`**: Tool execution and registry system. Includes built-ins like `webSearchTool`.
- **`@spider-adk/memory`**: Short-term and long-term memory stores for agents.
- **`@spider-adk/cli`**: Scaffolding and runner utilities.

## 🚀 Getting Started

### Installation

Clone the repository and install dependencies using `pnpm`:

```bash
git clone https://github.com/yourusername/spider-adk.git
cd spider-adk
pnpm install
pnpm build
```

### Quick Start

Creating an AI workflow is incredibly simple. Below is an example of spinning up a Research Agent and assigning it a structured task.

```typescript
import { z } from "zod";
import { createAgent, createTask, kickoff } from "@spider-adk/core";
import { OpenAIProvider } from "@spider-adk/llm";
import { webSearchTool, ToolRegistry } from "@spider-adk/tools";

// 1. Initialize Tools
const registry = new ToolRegistry();
registry.register(webSearchTool);

// 2. Define your Agent
const agent = createAgent({
  role: "Research Assistant",
  goal: "Return a concise structured answer",
  backstory: "You work carefully and use tools when helpful.",
  model: "gpt-4o-mini",
  temperature: 0.2,
  tools: ["web_search"]
});

// 3. Define the Task (with structured output!)
const task = createTask({
  agent,
  description: "Explain what a TypeScript agent framework needs in one short JSON object.",
  outputSchema: z.object({
    title: z.string(),
    summary: z.string()
  }),
  retries: 1
});

// 4. Initialize the LLM Provider
const llm = new OpenAIProvider(process.env.OPENAI_API_KEY!);

// 5. Kickoff the execution
const result = await kickoff({
  agent,
  task,
  llm,
  tools: registry
});

console.log(result); 
// Output is fully strongly-typed based on your Zod schema!
```

## 🛠️ Development

### Available Scripts

- `pnpm build`: Build all packages across the monorepo.
- `pnpm dev`: Run the local testing application (`apps/cli`).
- `pnpm typecheck`: Run TypeScript compilation checks without emitting files.

## 🤝 Contributing

Contributions are welcome! Whether it's adding new LLM providers, building new standard tools, or fixing bugs, feel free to open a PR.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License.
