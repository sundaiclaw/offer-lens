import type { z } from 'zod';

import type {
  confidenceLabelSchema,
  emailDraftSchema,
  extractedTermSchema,
  leveragePointSchema,
  offerAnalysisResponseSchema,
  offerIntakeInputSchema,
  preferredToneSchema,
  recommendedAskSchema,
  riskNoteSchema,
  riskToleranceSchema,
  tradeoffSchema,
  workModeSchema,
} from './schema';

export type OfferIntakeInput = z.infer<typeof offerIntakeInputSchema>;
export type OfferAnalysisResponse = z.infer<typeof offerAnalysisResponseSchema>;
export type ExtractedTerm = z.infer<typeof extractedTermSchema>;
export type RecommendedAsk = z.infer<typeof recommendedAskSchema>;
export type LeveragePoint = z.infer<typeof leveragePointSchema>;
export type RiskNote = z.infer<typeof riskNoteSchema>;
export type Tradeoff = z.infer<typeof tradeoffSchema>;
export type EmailDraft = z.infer<typeof emailDraftSchema>;
export type WorkMode = z.infer<typeof workModeSchema>;
export type PreferredTone = z.infer<typeof preferredToneSchema>;
export type RiskTolerance = z.infer<typeof riskToleranceSchema>;
export type ConfidenceLabel = z.infer<typeof confidenceLabelSchema>;
