import { z } from 'zod';

import { ConfigurationError } from './errors';

const baseEnvSchema = z.object({
  OPENROUTER_MODEL: z.string().trim().min(1).default('openai/gpt-4.1-mini'),
  OPENROUTER_SITE_URL: z.string().trim().url().optional(),
  OPENROUTER_SITE_NAME: z.string().trim().min(1).default('Offer Lens'),
  PORT: z.coerce.number().int().positive().default(8080),
});

const openRouterEnvSchema = baseEnvSchema.extend({
  OPENROUTER_API_KEY: z.string().trim().min(1),
});

export type ServerEnv = z.infer<typeof baseEnvSchema>;
export type OpenRouterEnv = z.infer<typeof openRouterEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;
let cachedOpenRouterEnv: OpenRouterEnv | null = null;

const formatEnvIssues = (issues: Array<{ path: Array<string | number> }>) =>
  issues.map((issue) => issue.path.join('.') || 'env').join(', ');

export const getServerEnv = (source: NodeJS.ProcessEnv = process.env): ServerEnv => {
  if (cachedServerEnv && source === process.env) {
    return cachedServerEnv;
  }

  const parsed = baseEnvSchema.safeParse(source);
  if (!parsed.success) {
    throw new ConfigurationError(`Missing or invalid server environment: ${formatEnvIssues(parsed.error.issues)}`);
  }

  if (source === process.env) {
    cachedServerEnv = parsed.data;
  }

  return parsed.data;
};

export const getOpenRouterEnv = (source: NodeJS.ProcessEnv = process.env): OpenRouterEnv => {
  if (cachedOpenRouterEnv && source === process.env) {
    return cachedOpenRouterEnv;
  }

  const parsed = openRouterEnvSchema.safeParse(source);
  if (!parsed.success) {
    throw new ConfigurationError(
      `Missing or invalid OpenRouter environment: ${formatEnvIssues(parsed.error.issues)}`,
    );
  }

  if (source === process.env) {
    cachedOpenRouterEnv = parsed.data;
  }

  return parsed.data;
};
