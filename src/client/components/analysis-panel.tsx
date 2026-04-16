import type { OfferAnalysisResponse } from '../../shared/types';
import { EmailDraftCard } from './email-draft-card';
import { EmptyState } from './empty-state';
import { ExtractedTermsCard } from './extracted-terms-card';
import { LeverageCard } from './leverage-card';
import { RisksCard } from './risks-card';
import { TradeoffsCard } from './tradeoffs-card';

export type AnalysisPanelProps = {
  result: OfferAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
};

export const AnalysisPanel = ({ result, isLoading, error }: AnalysisPanelProps) => {
  if (!result && !isLoading && !error) {
    return <EmptyState />;
  }

  return (
    <div className="results-stack">
      {isLoading ? (
        <section className="panel-card status-card" aria-live="polite" role="status">
          <p className="eyebrow">{result ? 'Refreshing analysis' : 'Analyzing offer'}</p>
          <h2>{result ? 'Refreshing your decision brief…' : 'Building your negotiation readout…'}</h2>
          <p>
            Reviewing the written offer against your priorities so the guidance stays tactical,
            grounded, and ready to use.
          </p>

          <div className="status-steps" aria-hidden="true">
            <div className="status-step">Extracting terms</div>
            <div className="status-step">Weighing leverage and risk</div>
            <div className="status-step">Drafting your reply</div>
          </div>

          {!result ? (
            <div className="loading-preview" aria-hidden="true">
              <div className="loading-block">
                <span className="skeleton-line skeleton-line-title" />
                <span className="skeleton-line" />
                <span className="skeleton-line skeleton-line-short" />
              </div>
              <div className="loading-block">
                <span className="skeleton-line skeleton-line-title" />
                <span className="skeleton-line" />
                <span className="skeleton-line" />
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {error ? (
        <section className="panel-card error-card" role="alert">
          <p className="eyebrow">Analysis issue</p>
          <h2>{result ? 'We couldn’t refresh the review' : 'We couldn’t complete the review'}</h2>
          <p>{error}</p>
          <ul className="action-list">
            <li>Paste the full written offer, including compensation details and the decision deadline.</li>
            <li>
              Add structured fields on the left if the pasted text is incomplete, noisy, or missing
              context.
            </li>
            <li>Retry in a moment if the AI service is temporarily busy.</li>
          </ul>
          {result ? <p className="muted-copy">Your last completed analysis is still visible below.</p> : null}
        </section>
      ) : null}

      {result ? (
        <div className={`result-group${isLoading ? ' is-refreshing' : ''}`}>
          <section className="panel-card summary-card">
            <div className="summary-header">
              <div>
                <p className="eyebrow">Decision brief</p>
                <h2>{result.summary}</h2>
              </div>
              <div className="confidence-chip">
                <span>{result.confidenceLabel} confidence</span>
                <strong>{Math.round(result.confidence * 100)}%</strong>
              </div>
            </div>

            <div className="caveat-list">
              {result.caveats.map((caveat) => (
                <p key={caveat}>• {caveat}</p>
              ))}
            </div>

            <p className="disclaimer">{result.disclaimer}</p>
          </section>

          <ExtractedTermsCard terms={result.extractedTerms} />
          <LeverageCard
            leveragePoints={result.leveragePoints}
            recommendedAsks={result.recommendedAsks}
          />
          <RisksCard risks={result.riskNotes} />
          <TradeoffsCard tradeoffs={result.tradeoffs} />
          <EmailDraftCard emailDraft={result.emailDraft} />
        </div>
      ) : null}
    </div>
  );
};
