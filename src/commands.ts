export interface SlashCommand {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export class CommandRegistry {
  private commands: Map<string, SlashCommand> = new Map();

  register(command: SlashCommand) {
    this.commands.set(command.name, command);
  }

  parseAndExecute(input: string) {
    if (!input.startsWith('/')) return false;
    
    const [name, ...args] = input.slice(1).split(' ');
    const command = this.commands.get(name);
    
    if (command) {
      command.execute(args);
      return true;
    }
    return false;
  }
}
