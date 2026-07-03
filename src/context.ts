import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

export async function getSystemContext(): Promise<string> {
  const contextLines: string[] = [
    `System Context:`
  ];

  // 1. Core OS and Directory
  contextLines.push(`- OS: ${os.platform()} ${os.release()}`);
  contextLines.push(`- CWD: ${process.cwd()}`);

  // 2. Git Status
  try {
    const { stdout: isGit } = await execAsync('git rev-parse --is-inside-work-tree');
    if (isGit.trim() === 'true') {
      const { stdout: branch } = await execAsync('git branch --show-current');
      const { stdout: status } = await execAsync('git status --short');
      
      contextLines.push(`- Git Branch: ${branch.trim()}`);
      if (status.trim()) {
        const truncatedStatus = status.length > 2000 ? status.substring(0, 2000) + '\n...(truncated)' : status.trim();
        contextLines.push(`- Git Status:\n${truncatedStatus}`);
      }
    }
  } catch (e) {
    // Ignore if not in a git repo
  }

  return contextLines.join('\n');
}
