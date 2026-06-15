import { OpenAIProvider } from "./openai.js";
import { GroqProvider } from "./groq.js";
import { GeminiProvider } from "./gemini.js";
import type { LLMProvider } from "./provider.js";

export interface ProviderConfig {
    apiKey?: string;
    [key: string]: any;
}

type ProviderCreator = (config?: ProviderConfig) => LLMProvider;

export class LLMFactory {
    private static providers: Map<string, ProviderCreator> = new Map();

    // Allows third-party developers to register custom providers
    static register(name: string, creator: ProviderCreator) {
        this.providers.set(name.toLowerCase(), creator);
    }

    // Instantiates the provider
    static create(name: string, config?: ProviderConfig): LLMProvider {
        const creator = this.providers.get(name.toLowerCase());
        if (!creator) {
            const available = Array.from(this.providers.keys()).join(', ');
            throw new Error(`LLM Provider '${name}' is not registered. Available providers: ${available}`);
        }
        return creator(config);
    }
}

// Auto-register built-in providers
LLMFactory.register('openai', (config) => {
    const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required in environment variables.");
    return new OpenAIProvider(apiKey);
});

LLMFactory.register('groq', (config) => {
    const apiKey = config?.apiKey || process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is required in environment variables.");
    return new GroqProvider(apiKey);
});

LLMFactory.register('gemini', (config) => {
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required in environment variables.");
    return new GeminiProvider(apiKey);
});
