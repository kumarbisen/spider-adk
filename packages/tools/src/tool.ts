import { z } from "zod";

export interface Tool<Input = unknown, Output = unknown> {
  name: string;
  description: string;
  schema: z.ZodType<Input>;
  execute(input: Input): Promise<Output> | Output;
}