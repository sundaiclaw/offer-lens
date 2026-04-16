import type { ExtractedTerm } from '../../shared/types';

export const ExtractedTermsCard = ({ terms }: { terms: ExtractedTerm[] }) => {
  return (
    <section className="panel-card">
      <div className="section-heading tight">
        <p className="eyebrow">Offer terms</p>
        <h2>What the offer says</h2>
      </div>
      {terms.length === 0 ? (
        <p className="muted-copy">The model could not confidently extract structured terms from the provided text.</p>
      ) : (
        <div className="stack-list">
          {terms.map((term) => (
            <article className="insight-card" key={`${term.label}-${term.value}`}>
              <div className="insight-header">
                <h3>{term.label}</h3>
                <strong>{term.value}</strong>
              </div>
              {term.evidence ? <p className="evidence">Evidence: “{term.evidence}”</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
