import Groq from "groq-sdk";
import type { LLMProvider } from "./provider.js";
import type { LLMRequest, LLMResponse } from "@agent-framework/core";


export class GroqProvider implements LLMProvider {
    private client: Groq;


    constructor(apikey: string) {
        this.client = new Groq({ apiKey: apikey });
    }

    async chat(request: LLMRequest): Promise<LLMResponse> {

        const messages = request.messages.map((message: any) => ({
            role: message.role,
            content: message.content
        }));

        if (request.responseSchema) {
            messages.push({
                role: "system",
                content: "You MUST output your response in valid JSON format."
            });
        }
        const response = await this.client.chat.completions.create({
            model: request.model ?? "llama-3.1-8b-instant",
            ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
            // Tell Groq to strictly return a JSON object
            ...(request.responseSchema ? { response_format: { type: "json_object" } } : {}),
            messages
        });



        const content = response.choices[0]?.message?.content ?? "";
        return { content }

    }



}