import { z } from 'zod';

export interface Tool<T = any> {
  name: string;
  description: string;
  schema: z.ZodType<T>;
  execute: (args: T) => Promise<string>;
}
