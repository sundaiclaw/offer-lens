import request from 'supertest';

import { createApp } from '../../src/server/app';
import { UpstreamAIError } from '../../src/server/lib/errors';
import type { OfferAnalysisResponse } from '../../src/shared/types';

const mockResponse: OfferAnalysisResponse = {
  summary: 'Lead with a salary ask and keep the tone collaborative.',
  extractedTerms: [{ label: 'Base salary', value: '$180,000', evidence: 'Base salary is $180,000.' }],
  recommendedAsks: [
    {
      priority: 1,
      ask: 'Request $195,000 base.',
      rationale: 'It is the largest guaranteed value lever.',
      evidence: 'Current base is below your target.',
    },
  ],
  leveragePoints: [{ title: 'Relevant scope', detail: 'The team needs your domain depth.', evidence: 'Role leads platform strategy.' }],
  riskNotes: [{ title: 'Short fuse', detail: 'The deadline is only a few days away.', severity: 'high' }],
  tradeoffs: [
    {
      title: 'Salary vs sign-on',
      choice: 'Ask salary first, then sign-on if they cap salary.',
      upside: 'Better recurring comp.',
      downside: 'Could reduce flexibility elsewhere.',
      recommendation: 'Anchor on salary.',
    },
  ],
  emailDraft: {
    subject: 'Offer follow-up',
    body: 'Thank you again for the offer. I would love to discuss compensation and timing.',
  },
  confidence: 0.7,
  confidenceLabel: 'Moderate',
  caveats: ['The equity package is not fully specified.'],
  disclaimer:
    'Offer Lens provides decision support, not legal, tax, or financial advice. Validate critical details with the employer and a qualified advisor when needed.',
};

describe('POST /api/analyze', () => {
  it('returns 400 on invalid input', async () => {
    const app = createApp({
      analyzeOffer: vi.fn(),
    });

    const response = await request(app).post('/api/analyze').send({ rawOfferText: '' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_REQUEST');
  });

  it('returns success with a mocked analysis response', async () => {
    const analyzeOffer = vi.fn().mockResolvedValue(mockResponse);
    const app = createApp({ analyzeOffer });

    const response = await request(app).post('/api/analyze').send({
      rawOfferText: 'Offer: $180k base salary and a Friday deadline.',
      offerDetails: { workMode: 'hybrid' },
      priorities: {
        topGoals: ['Increase base salary'],
        minimumAcceptableConditions: [],
        nonNegotiables: [],
        preferredTone: 'collaborative',
        riskTolerance: 'moderate',
      },
    });

    expect(response.status).toBe(200);
    expect(analyzeOffer).toHaveBeenCalledTimes(1);
    expect(response.body.emailDraft.subject).toBe('Offer follow-up');
  });

  it('returns a user-safe error payload on upstream failure', async () => {
    const app = createApp({
      analyzeOffer: vi.fn().mockRejectedValue(new UpstreamAIError()),
    });

    const response = await request(app).post('/api/analyze').send({
      rawOfferText: 'Offer: $180k base salary and a Friday deadline.',
      offerDetails: { workMode: 'hybrid' },
      priorities: {
        topGoals: ['Increase base salary'],
        minimumAcceptableConditions: [],
        nonNegotiables: [],
        preferredTone: 'collaborative',
        riskTolerance: 'moderate',
      },
    });

    expect(response.status).toBe(502);
    expect(response.body.error.code).toBe('UPSTREAM_AI_ERROR');
    expect(response.body.error.message).toMatch(/could not finish the AI analysis/i);
  });
});
