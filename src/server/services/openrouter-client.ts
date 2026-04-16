import OpenAI from 'openai';

import { getOpenRouterEnv } from '../lib/env';
import { UpstreamAIError, UpstreamAITimeoutError } from '../lib/errors';

export type OpenRouterRequest = {
  systemPrompt: string;
  userPrompt: string;
};

export class OpenRouterClient {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const env = getOpenRouterEnv();

    this.model = env.OPENROUTER_MODEL;
    this.client = new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        ...(env.OPENROUTER_SITE_URL ? { 'HTTP-Referer': env.OPENROUTER_SITE_URL } : {}),
        ...(env.OPENROUTER_SITE_NAME ? { 'X-Title': env.OPENROUTER_SITE_NAME } : {}),
      },
    });
  }

  async generateStructuredAnalysis({ systemPrompt, userPrompt }: OpenRouterRequest): Promise<string> {
    const completionPromise = this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      max_tokens: 1800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new UpstreamAITimeoutError()), 30000);
    });

    let completion: Awaited<typeof completionPromise>;
    try {
      completion = await Promise.race([completionPromise, timeoutPromise]);
    } catch (error) {
      if (error instanceof UpstreamAITimeoutError) {
        throw error;
      }

      throw new UpstreamAIError();
    }

    const messageContent = completion.choices[0]?.message?.content;
    if (!messageContent) {
      throw new UpstreamAIError('The AI service returned an empty response.');
    }

    if (typeof messageContent === 'string') {
      return messageContent;
    }

    const contentParts = messageContent as Array<{ text?: string }>;
    const combined = contentParts
      .map((part) => (typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim();

    if (combined) {
      return combined;
    }

    throw new UpstreamAIError('The AI service returned a response format that could not be read.');
  }
}
