import type { OfferIntakeInput } from '../../shared/types';

const responseShape = `{
  "summary": "string",
  "extractedTerms": [{ "label": "string", "value": "string", "evidence": "string | optional" }],
  "recommendedAsks": [{ "priority": 1, "ask": "string", "rationale": "string", "evidence": "string | optional" }],
  "leveragePoints": [{ "title": "string", "detail": "string", "evidence": "string | optional" }],
  "riskNotes": [{ "title": "string", "detail": "string", "severity": "low | medium | high" }],
  "tradeoffs": [{ "title": "string", "choice": "string", "upside": "string", "downside": "string", "recommendation": "string | optional" }],
  "emailDraft": { "subject": "string", "body": "string" },
  "confidence": 0.0,
  "confidenceLabel": "Low | Moderate | High",
  "caveats": ["string"],
  "disclaimer": "string"
}`;

export type OfferAnalysisPrompt = {
  systemPrompt: string;
  userPrompt: string;
};

export const buildOfferAnalysisPrompt = (input: OfferIntakeInput): OfferAnalysisPrompt => {
  const systemPrompt = [
    'You are Offer Lens, a measured career negotiation strategist.',
    'Analyze the offer details and the candidate priorities with nuance.',
    'Do not provide legal, tax, or financial advice.',
    'Be tactically useful without sounding overconfident.',
    'Tie recommendations to evidence from the offer text whenever possible.',
    'Return strict JSON only. No markdown fences. No commentary outside the JSON object.',
    'The response MUST match this shape exactly:',
    responseShape,
  ].join('\n');

  const userPrompt = [
    'Candidate offer input:',
    JSON.stringify(input, null, 2),
    '',
    'Instructions:',
    '- Extract the concrete offer terms, honoring structured fields as clarifying overrides.',
    '- Recommend a prioritized ask order with concise rationale.',
    '- Identify leverage points and risks, including deadline pressure or ambiguity.',
    '- Explain tradeoffs so the candidate knows what to push, accept, or defer.',
    '- Draft a concise professional email that matches the recommended strategy and preferred tone.',
    '- Include 1 to 3 caveats, a confidence score from 0 to 1, and a matching confidence label.',
    '- If evidence is weak, say so explicitly in the relevant item rather than inventing certainty.',
  ].join('\n');

  return { systemPrompt, userPrompt };
};
