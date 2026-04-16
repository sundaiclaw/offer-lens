import { render, screen } from '@testing-library/react';

import { AnalysisPanel } from '../../src/client/components/analysis-panel';

describe('AnalysisPanel', () => {
  const result = {
    summary: 'Strong offer with room to negotiate salary and start date.',
    confidence: 0.82,
    confidenceLabel: 'high' as const,
    caveats: ['Equity refresh timing is still unclear.'],
    disclaimer: 'Offer Lens provides negotiation guidance, not legal or tax advice.',
    extractedTerms: [],
    leveragePoints: [],
    recommendedAsks: [],
    riskNotes: [],
    tradeoffs: [],
    emailDraft: {
      subject: 'Offer follow-up',
      body: 'Thank you again for the offer.',
    },
  };

  it('shows a helpful empty state before analysis starts', () => {
    render(<AnalysisPanel error={null} isLoading={false} result={null} />);

    expect(screen.getByText(/paste the written offer to open your decision brief/i)).toBeInTheDocument();
    expect(screen.getByText(/best inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/you’ll get/i)).toBeInTheDocument();
  });

  it('shows a richer loading state while analysis is running', () => {
    render(<AnalysisPanel error={null} isLoading result={null} />);

    expect(screen.getByRole('status')).toHaveTextContent(/building your negotiation readout/i);
    expect(screen.getByText(/extracting terms/i)).toBeInTheDocument();
    expect(screen.getByText(/weighing leverage and risk/i)).toBeInTheDocument();
    expect(screen.getByText(/drafting your reply/i)).toBeInTheDocument();
  });

  it('shows actionable error guidance while preserving the last completed result', () => {
    render(
      <AnalysisPanel
        error="The AI analysis timed out. Please try again."
        isLoading={false}
        result={result}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/we couldn’t refresh the review/i);
    expect(screen.getByText(/retry in a moment if the ai service is temporarily busy/i)).toBeInTheDocument();
    expect(screen.getByText(/your last completed analysis is still visible below/i)).toBeInTheDocument();
    expect(screen.getByText(result.summary)).toBeInTheDocument();
  });
});
