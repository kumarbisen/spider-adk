import { LLMProvider } from '../QueryEngine';
import { GeminiStudioProvider } from './GeminiStudioProvider';
import { GroqProvider } from './GroqProvider';

function getEnv(name: string): string | undefined {
  const runtime = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return runtime.process?.env?.[name];
}

function requireEnv(name: string): string {
  const value = getEnv(name)?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in your .env file.`
    );
  }
  return value;
}

export function createProviderFromEnv(): LLMProvider {
  const provider = (getEnv('LLM_PROVIDER') ?? 'groq').toLowerCase();

  if (provider === 'groq') {
    return new GroqProvider(
      requireEnv('GROQ_API_KEY'),
      getEnv('GROQ_MODEL') ?? 'llama-3.3-70b-versatile'
    );
  }

  if (provider === 'gemini') {
    return new GeminiStudioProvider(
      requireEnv('GOOGLE_API_KEY'),
      getEnv('GEMINI_MODEL') ?? 'gemini-2.5-flash'
    );
  }

  throw new Error('Unsupported LLM_PROVIDER. Use "groq" or "gemini".');
}