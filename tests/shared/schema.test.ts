import {
  offerAnalysisResponseSchema,
  offerIntakeInputSchema,
  DEFAULT_ANALYSIS_DISCLAIMER,
} from '../../src/shared/schema';

describe('shared schemas', () => {
  it('accepts a valid offer intake payload', () => {
    const parsed = offerIntakeInputSchema.safeParse({
      rawOfferText: 'Base: $180k, sign-on $20k, deadline Friday.',
      offerDetails: {
        company: 'Acme AI',
        roleTitle: 'Staff Engineer',
        workMode: 'hybrid',
      },
      priorities: {
        topGoals: ['Increase base salary'],
        minimumAcceptableConditions: ['One remote day'],
        nonNegotiables: ['No relocation before August'],
        preferredTone: 'confident',
        riskTolerance: 'moderate',
      },
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects an empty offer intake payload', () => {
    const parsed = offerIntakeInputSchema.safeParse({
      rawOfferText: '   ',
    });

    expect(parsed.success).toBe(false);
  });

  it('accepts a valid offer analysis response', () => {
    const parsed = offerAnalysisResponseSchema.safeParse({
      summary: 'Lead with a base salary ask, then clarify leveling and deadline flexibility.',
      extractedTerms: [{ label: 'Base salary', value: '$180,000', evidence: 'Base salary will be $180,000.' }],
      recommendedAsks: [
        {
          priority: 1,
          ask: 'Increase base salary to $195,000.',
          rationale: 'Base pay compounds and anchors the package.',
          evidence: 'Current base is below market.' ,
        },
      ],
      leveragePoints: [
        {
          title: 'Strong scope fit',
          detail: 'The role owns a key platform area.',
          evidence: 'You will lead the platform reliability roadmap.',
        },
      ],
      riskNotes: [{ title: 'Short deadline', detail: 'A compressed deadline reduces room to compare offers.', severity: 'high' }],
      tradeoffs: [
        {
          title: 'Cash vs equity',
          choice: 'Push more on salary if you value certainty.',
          upside: 'More guaranteed compensation.',
          downside: 'May leave less room on equity.',
          recommendation: 'Prioritize salary first.',
        },
      ],
      emailDraft: {
        subject: 'Offer follow-up',
        body: 'Thanks again for the offer. I would love to discuss compensation and start date.',
      },
      confidence: 0.67,
      confidenceLabel: 'Moderate',
      caveats: ['The level mapping is inferred from limited text.'],
      disclaimer: DEFAULT_ANALYSIS_DISCLAIMER,
    });

    expect(parsed.success).toBe(true);
  });
});
