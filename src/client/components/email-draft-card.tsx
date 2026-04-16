import type { EmailDraft } from '../../shared/types';
import { CopyButton } from './copy-button';

export const EmailDraftCard = ({ emailDraft }: { emailDraft: EmailDraft }) => {
  const combinedDraft = `Subject: ${emailDraft.subject}\n\n${emailDraft.body}`;

  return (
    <section className="panel-card">
      <div className="section-heading tight section-heading-inline">
        <div>
          <p className="eyebrow">Ready to send</p>
          <h2>Email draft</h2>
        </div>
        <CopyButton text={combinedDraft} label="Copy email" />
      </div>

      <div className="draft-block">
        <span className="metric-label">Subject</span>
        <p className="draft-subject">{emailDraft.subject}</p>
      </div>

      <div className="draft-block">
        <span className="metric-label">Body</span>
        <pre className="draft-body">{emailDraft.body}</pre>
      </div>
    </section>
  );
};
