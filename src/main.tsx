import 'dotenv/config';
import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { App } from './screens/App'; // This will be your main Ink UI
import { ToolRegistry } from './tools';
import { QueryEngine } from './QueryEngine';
import { createProviderFromEnv } from './services/providerFactory';

const program = new Command();

program
  .name('spider')
  .description('Interactive AI Coding Agent')
  .version('1.0.0')
  .action(async () => {
    const tools = new ToolRegistry();
    const provider = createProviderFromEnv();
    const engine = new QueryEngine(provider, tools);

    console.clear();
    const { waitUntilExit } = render(<App engine={engine} />);
    await waitUntilExit();
  });

program.parse(process.argv);
