import { OpenAICompatibleProvider } from './OpenAICompatibleProvider';

export class GeminiStudioProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model = 'gemini-2.5-flash') {
    super({
      apiKey,
      model,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
    });
  }
}