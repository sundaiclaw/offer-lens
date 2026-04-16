import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OfferIntakeForm } from '../../src/client/components/offer-intake-form';

describe('OfferIntakeForm', () => {
  it('shows required-field validation', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<OfferIntakeForm isSubmitting={false} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /generate negotiation plan/i }));

    expect(await screen.findByText(/paste the offer text to analyze/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a typed payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<OfferIntakeForm isSubmitting={false} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/offer text/i), 'Offer: $180k base, 15% bonus, decision by Friday.');
    await user.type(screen.getByLabelText(/company/i), 'Acme AI');
    await user.type(screen.getByLabelText(/role \/ title/i), 'Senior PM');
    await user.type(screen.getByLabelText(/top goals/i), 'Increase base salary\nClarify level');
    await user.selectOptions(screen.getByLabelText(/risk tolerance/i), 'low');
    await user.selectOptions(screen.getByLabelText(/preferred tone/i), 'confident');
    await user.click(screen.getByRole('button', { name: /generate negotiation plan/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        rawOfferText: 'Offer: $180k base, 15% bonus, decision by Friday.',
        offerDetails: expect.objectContaining({
          company: 'Acme AI',
          roleTitle: 'Senior PM',
        }),
        priorities: expect.objectContaining({
          topGoals: ['Increase base salary', 'Clarify level'],
          riskTolerance: 'low',
          preferredTone: 'confident',
        }),
      }),
    );
  });
});
