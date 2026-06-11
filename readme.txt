agent-framework/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.cjs
├── .gitignore
├── README.md
├── apps/
│   └── cli/
│       ├── package.json
│       └── src/
│           └── index.ts
└── packages/
    ├── core/
    │   ├── package.json
    │   └── src/
    │       ├── index.ts
    │       ├── agent.ts
    │       ├── task.ts
    │       ├── crew.ts
    │       ├── flow.ts
    │       ├── runtime.ts
    │       ├── events.ts
    │       └── types.ts
    ├── llm/
    │   ├── package.json
    │   └── src/
    │       ├── index.ts
    │       ├── provider.ts
    │       ├── openai.ts
    │       └── prompt.ts
    ├── tools/
    │   ├── package.json
    │   └── src/
    │       ├── index.ts
    │       ├── tool.ts
    │       ├── registry.ts
    │       └── builtins/
    │           └── web-search.ts
    ├── memory/
    │   ├── package.json
    │   └── src/
    │       ├── index.ts
    │       ├── memory.ts
    │       └── in-memory.ts
    └── cli/
        ├── package.json
        └── src/
            ├── index.ts
            └── commands/
                ├── init.ts
                └── run.ts