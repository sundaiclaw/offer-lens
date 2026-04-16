import { z } from 'zod';

const blankToUndefined = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const optionalText = (max = 400) =>
  z.preprocess(blankToUndefined, z.string().max(max).optional());

const listItemSchema = z.string().trim().min(1).max(180);

export const workModeSchema = z.enum(['remote', 'hybrid', 'onsite', 'unknown']);
export const preferredToneSchema = z.enum(['warm', 'direct', 'confident', 'collaborative']);
export const riskToleranceSchema = z.enum(['low', 'moderate', 'high']);
export const confidenceLabelSchema = z.enum(['Low', 'Moderate', 'High']);
export const riskSeveritySchema = z.enum(['low', 'medium', 'high']);

export const offerDetailsSchema = z.object({
  company: optionalText(120),
  roleTitle: optionalText(120),
  level: optionalText(80),
  location: optionalText(120),
  workMode: workModeSchema.default('unknown'),
  employmentType: optionalText(80),
  baseSalary: optionalText(80),
  bonus: optionalText(120),
  equity: optionalText(120),
  signOn: optionalText(120),
  startDate: optionalText(120),
  deadline: optionalText(120),
  recruiterNotes: optionalText(600),
  constraints: optionalText(600),
});

export const prioritiesSchema = z.object({
  topGoals: z.array(listItemSchema).max(6).default([]),
  minimumAcceptableConditions: z.array(listItemSchema).max(6).default([]),
  nonNegotiables: z.array(listItemSchema).max(6).default([]),
  preferredTone: preferredToneSchema.default('collaborative'),
  riskTolerance: riskToleranceSchema.default('moderate'),
  contextNotes: optionalText(600),
});

export const offerIntakeInputSchema = z.object({
  rawOfferText: z.string().trim().min(1, 'Paste the offer text to analyze.'),
  offerDetails: offerDetailsSchema.default({ workMode: 'unknown' }),
  priorities: prioritiesSchema.default({
    topGoals: [],
    minimumAcceptableConditions: [],
    nonNegotiables: [],
    preferredTone: 'collaborative',
    riskTolerance: 'moderate',
  }),
});

export const extractedTermSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(240),
  evidence: optionalText(400),
});

export const recommendedAskSchema = z.object({
  priority: z.number().int().min(1).max(10).optional(),
  ask: z.string().trim().min(1).max(240),
  rationale: z.string().trim().min(1).max(500),
  evidence: optionalText(400),
});

export const leveragePointSchema = z.object({
  title: z.string().trim().min(1).max(120),
  detail: z.string().trim().min(1).max(500),
  evidence: optionalText(400),
});

export const riskNoteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  detail: z.string().trim().min(1).max(500),
  severity: riskSeveritySchema.default('medium'),
});

export const tradeoffSchema = z.object({
  title: z.string().trim().min(1).max(120),
  choice: z.string().trim().min(1).max(220),
  upside: z.string().trim().min(1).max(320),
  downside: z.string().trim().min(1).max(320),
  recommendation: optionalText(320),
});

export const emailDraftSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
});

export const DEFAULT_ANALYSIS_DISCLAIMER =
  'Offer Lens provides decision support, not legal, tax, or financial advice. Validate critical details with the employer and a qualified advisor when needed.';

export const DEFAULT_CAVEAT =
  'AI can miss context or over-index on incomplete offer language, so sanity-check the plan before sending it.';

export const offerAnalysisResponseSchema = z.object({
  summary: z.string().trim().min(1).max(1200),
  extractedTerms: z.array(extractedTermSchema).default([]),
  recommendedAsks: z.array(recommendedAskSchema).default([]),
  leveragePoints: z.array(leveragePointSchema).default([]),
  riskNotes: z.array(riskNoteSchema).default([]),
  tradeoffs: z.array(tradeoffSchema).default([]),
  emailDraft: emailDraftSchema,
  confidence: z.number().min(0).max(1),
  confidenceLabel: confidenceLabelSchema,
  caveats: z.array(z.string().trim().min(1).max(220)).default([DEFAULT_CAVEAT]),
  disclaimer: z.string().trim().min(1).max(400).default(DEFAULT_ANALYSIS_DISCLAIMER),
});
