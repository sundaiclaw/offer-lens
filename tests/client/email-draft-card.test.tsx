import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EmailDraftCard } from '../../src/client/components/email-draft-card';

describe('EmailDraftCard', () => {
  it('renders the subject and body and copies the draft', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <EmailDraftCard
        emailDraft={{
          subject: 'Offer follow-up',
          body: 'Thanks again for the offer. I would love to discuss compensation.',
        }}
      />,
    );

    expect(screen.getByText('Offer follow-up')).toBeInTheDocument();
    expect(screen.getByText(/thanks again for the offer/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /copy email/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Subject: Offer follow-up'));
    expect(await screen.findByRole('button', { name: /copied/i })).toBeInTheDocument();
  });
});
