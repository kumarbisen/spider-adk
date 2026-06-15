import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMProvider } from "./provider.js";
import type { LLMRequest, LLMResponse } from "@agent-framework/core";


export class GeminiProvider implements LLMProvider {

    private client: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.client = new GoogleGenerativeAI(apiKey);
    }

    async chat(request: LLMRequest): Promise<LLMResponse> {
        const model = this.client.getGenerativeModel({
            model: request.model ?? "gemini-1.5-flash",
            generationConfig: {
                ...(request.temperature !== undefined ? { temperature: request.temperature } : {})
            }
        });

        // Convert messages to Gemini format (user/model)
        const history = request.messages.filter(m => m.role !== 'system').map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));


        // Handle System Prompts
        const systemMessages = request.messages.filter(m => m.role === 'system');
        if (systemMessages.length > 0) {
            const systemPrompt = systemMessages.map(m => m.content).join("\n");
            const firstHistory = history[0];
            const firstPart = firstHistory?.parts[0];
            if (firstHistory && firstHistory.role === 'user' && firstPart) {
                firstPart.text = `System: ${systemPrompt}\n\nUser: ${firstPart.text}`;
            } else {
                history.unshift({ role: 'user', parts: [{ text: `System: ${systemPrompt}` }] });
            }
        }

        const chatSession = model.startChat({ history: history.slice(0, -1) });
        const lastMessage = history[history.length - 1] || { role: 'user', parts: [{ text: '' }] };


        const result = await chatSession.sendMessage(lastMessage.parts[0]!.text);
        const content = result.response.text();




        return { content };
    }

}