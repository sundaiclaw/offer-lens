import { DEFAULT_ANALYSIS_DISCLAIMER, DEFAULT_CAVEAT } from '../../shared/schema';
import type { OfferAnalysisResponse, OfferIntakeInput } from '../../shared/types';
import { buildOfferAnalysisPrompt } from './prompt-builder';
import { OpenRouterClient } from './openrouter-client';
import { parseOfferAnalysisResponse } from './response-parser';

export type OfferAnalysisServiceDeps = {
  client?: Pick<OpenRouterClient, 'generateStructuredAnalysis'>;
};

export const analyzeOffer = async (
  input: OfferIntakeInput,
  deps: OfferAnalysisServiceDeps = {},
): Promise<OfferAnalysisResponse> => {
  const client = deps.client ?? new OpenRouterClient();
  const prompt = buildOfferAnalysisPrompt(input);
  const rawResponse = await client.generateStructuredAnalysis(prompt);
  const parsed = parseOfferAnalysisResponse(rawResponse);

  return {
    ...parsed,
    caveats: parsed.caveats.length > 0 ? parsed.caveats : [DEFAULT_CAVEAT],
    disclaimer: parsed.disclaimer || DEFAULT_ANALYSIS_DISCLAIMER,
  };
};
