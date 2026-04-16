import { AIResponseParseError } from '../../src/server/lib/errors';
import {
  normalizeOfferAnalysisPayload,
  parseOfferAnalysisResponse,
  stripMarkdownCodeFences,
} from '../../src/server/services/response-parser';

describe('response parser', () => {
  const jsonBody = JSON.stringify({
    summary: 'Start with base salary and confirm the deadline flexibility.',
    extractedTerms: [{ label: 'Base salary', value: '$180,000', evidence: 'Base salary is $180,000' }],
    recommendedAsks: [
      {
        priority: 1,
        ask: 'Request $195,000 base.',
        rationale: 'Salary has the biggest compounding value.',
        evidence: 'The current salary is below your target.',
      },
    ],
    leveragePoints: [{ title: 'Strong fit', detail: 'Your background matches the scope.', evidence: 'Lead platform roadmap' }],
    riskNotes: [{ title: 'Tight deadline', detail: 'You only have three days to respond.', severity: 'high' }],
    tradeoffs: [
      {
        title: 'Salary vs equity',
        choice: 'Push salary first if you want certainty.',
        upside: 'More guaranteed cash.',
        downside: 'Potentially less room on equity.',
        recommendation: 'Lead with salary.',
      },
    ],
    emailDraft: { subject: 'Offer follow-up', body: 'Thanks again for the offer.' },
    confidence: 0.64,
    confidenceLabel: 'Moderate',
    caveats: ['Equity value depends on future company performance.'],
    disclaimer: 'Decision support only.',
  });

  it('handles plain JSON', () => {
    const result = parseOfferAnalysisResponse(jsonBody);

    expect(result.summary).toContain('Start with base salary');
    expect(result.emailDraft.subject).toBe('Offer follow-up');
  });

  it('handles fenced JSON', () => {
    const raw = `\n\`\`\`json\n${jsonBody}\n\`\`\``;

    expect(stripMarkdownCodeFences(raw)).toBe(jsonBody);
    expect(parseOfferAnalysisResponse(raw).recommendedAsks[0]?.ask).toBe('Request $195,000 base.');
  });

  it('rejects malformed output', () => {
    expect(() => parseOfferAnalysisResponse('not json')).toThrow(AIResponseParseError);
  });

  it('normalizes missing optional fields safely', () => {
    const result = normalizeOfferAnalysisPayload({
      recommendedAsks: ['Ask for a higher base salary'],
      emailDraft: 'Thank you for the offer. Could we discuss compensation?',
      confidence: '82%'
    });

    expect(result.summary).toContain('Validate this ask');
    expect(result.caveats.length).toBeGreaterThan(0);
    expect(result.disclaimer).toContain('decision support');
    expect(result.confidenceLabel).toBe('High');
    expect(result.emailDraft.subject).toBe('Follow-up on offer details');
  });
});
