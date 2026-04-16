import { buildOfferAnalysisPrompt } from '../../src/server/services/prompt-builder';

describe('buildOfferAnalysisPrompt', () => {
  it('includes offer text and priorities in the prompt', () => {
    const prompt = buildOfferAnalysisPrompt({
      rawOfferText: 'The offer is $180k base, 12% bonus, and a Friday deadline.',
      offerDetails: {
        company: 'Acme AI',
        roleTitle: 'Senior PM',
        workMode: 'hybrid',
      },
      priorities: {
        topGoals: ['Increase base salary', 'Keep the relationship warm'],
        minimumAcceptableConditions: [],
        nonNegotiables: ['No relocation before September'],
        preferredTone: 'collaborative',
        riskTolerance: 'low',
      },
    });

    expect(prompt.systemPrompt).toContain('Return strict JSON only');
    expect(prompt.userPrompt).toContain('The offer is $180k base');
    expect(prompt.userPrompt).toContain('Increase base salary');
    expect(prompt.userPrompt).toContain('Keep the relationship warm');
    expect(prompt.userPrompt).toContain('No relocation before September');
  });
});
