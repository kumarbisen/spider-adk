import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { App } from './screens/App'; // This will be your main Ink UI

const program = new Command();

program
  .name('spider')
  .description('Interactive AI Coding Agent')
  .version('1.0.0')
  .action(async () => {
    console.clear();
    const { waitUntilExit } = render(<App />);
    await waitUntilExit();
  });

program.parse(process.argv);
