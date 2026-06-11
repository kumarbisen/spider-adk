import { z } from "zod";
import type { Tool } from "../tool.js";

export const webSearchTool: Tool<{ query: string }, { results: string[] }> = {
  name: "web_search",
  description: "Search the web for relevant information.",
  schema: z.object({
    query: z.string().min(1)
  }),
  async execute(input) {
    return {
      results: [`Search placeholder for: ${input.query}`]
    };
  }
};