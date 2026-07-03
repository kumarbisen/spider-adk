# 🤖 Spider ADK

> **An interactive, terminal-based AI agent framework inspired by Claude Code.**

Spider ADK is a powerful, extensible framework for building an interactive CLI-based AI coding assistant and agent. It provides a robust architecture for tools, slash commands, plugins, and skills, letting you build a highly capable assistant that can navigate code, run terminal commands, and reason through tasks.

---

## ✨ Features

- **Interactive CLI Interface**: Built with Ink and React, providing a rich, terminal-native UI.
- **Skill System**: Extend agent capabilities dynamically with custom skills (`src/skills/`).
- **Tool Registry**: Easily equip your agent with standard or custom tools (file reading, web searching, bash commands).
- **Slash Commands**: Rapidly execute common workflows via intuitive slash commands.
- **LLM Query Engine**: Core integration with pluggable providers (Groq and Gemini Studio) to power agent reasoning.
- **Context Management**: Collects and organizes system and user context dynamically.
- **Cost Tracking**: Built-in token and cost tracking for transparent usage.
- **Extensible Architecture**: Support for plugins, keybindings, Vim mode, and more.

## 🏗️ Architecture

The codebase is structured to provide a comprehensive interactive agent environment:

```text
src/
├── main.tsx                 # Entrypoint (Commander.js-based CLI parser)
├── commands.ts              # Command registry
├── tools.ts                 # Tool registry
├── Tool.ts                  # Tool type definitions
├── QueryEngine.ts           # LLM query engine (core Anthropic API caller)
├── context.ts               # System/user context collection
├── cost-tracker.ts          # Token cost tracking
│
├── commands/                # Slash command implementations (~50)
├── tools/                   # Agent tool implementations (~40)
├── components/              # Ink UI components (~140)
├── hooks/                   # React hooks
├── services/                # External service integrations
├── screens/                 # Full-screen UIs (Doctor, REPL, Resume)
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│
├── bridge/                  # IDE integration bridge (VS Code, JetBrains)
├── coordinator/             # Multi-agent coordinator
├── plugins/                 # Plugin system
├── skills/                  # Skill system
├── keybindings/             # Keybinding configuration
├── vim/                     # Vim mode
├── voice/                   # Voice input
├── remote/                  # Remote sessions
├── server/                  # Server mode
├── memdir/                  # Memory directory (persistent memory)
├── tasks/                   # Task management
├── state/                   # State management
├── migrations/              # Config migrations
├── schemas/                 # Config schemas (Zod)
├── entrypoints/             # Initialization logic
├── ink/                     # Ink renderer wrapper
├── buddy/                   # Companion sprite (Easter egg)
├── native-ts/               # Native TypeScript utils
├── outputStyles/            # Output styling
├── query/                   # Query pipeline
└── upstreamproxy/           # Proxy configuration
```

For more inspiration, see the original concept: [claude-code](https://github.com/hkirat/claude-code).

## 🚀 Getting Started

### Provider Setup (Groq or Gemini Studio)

This project now uses an OpenAI-compatible provider layer and supports:

- `groq` via `https://api.groq.com/openai/v1`
- `gemini` (Google AI Studio) via `https://generativelanguage.googleapis.com/v1beta/openai/`

Create a `.env` file in the project root and add one of the following:

```bash
# Choose one: groq | gemini
LLM_PROVIDER=groq

# For Groq
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# For Gemini Studio (Google AI Studio)
# LLM_PROVIDER=gemini
# GOOGLE_API_KEY=your_google_ai_studio_key
# GEMINI_MODEL=gemini-2.5-flash
```

Then construct the engine with the provider factory:

```ts
import { QueryEngine } from './QueryEngine';
import { ToolRegistry } from './tools';
import { createProviderFromEnv } from './services/providerFactory';

const tools = new ToolRegistry();
const provider = createProviderFromEnv();
const engine = new QueryEngine(provider, tools);
```

Files added for provider support:

- `src/services/OpenAICompatibleProvider.ts`
- `src/services/GroqProvider.ts`
- `src/services/GeminiStudioProvider.ts`
- `src/services/providerFactory.ts`

### Installation

Clone the repository and install dependencies using `pnpm`:

```bash
git clone https://github.com/yourusername/spider-adk.git
cd spider-adk
pnpm install
pnpm build
```

### Running the Agent

Start the interactive session:

```bash
pnpm dev
```

## 🤝 Contributing

Contributions are welcome! Whether it's adding new tools, enhancing the Ink UI, or creating new slash commands, feel free to open a PR.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License.
