import type { LeveragePoint, RecommendedAsk } from '../../shared/types';

export type LeverageCardProps = {
  recommendedAsks: RecommendedAsk[];
  leveragePoints: LeveragePoint[];
};

export const LeverageCard = ({ recommendedAsks, leveragePoints }: LeverageCardProps) => {
  return (
    <section className="panel-card">
      <div className="section-heading tight">
        <p className="eyebrow">Negotiation plan</p>
        <h2>Recommended ask order</h2>
      </div>

      <div className="stack-list">
        {recommendedAsks.length === 0 ? (
          <p className="muted-copy">No prioritized asks were returned. Review the caveats before acting.</p>
        ) : (
          recommendedAsks.map((item, index) => (
            <article className="insight-card" key={`${item.ask}-${index}`}>
              <div className="pill-row">
                <span className="priority-pill">Ask {item.priority ?? index + 1}</span>
              </div>
              <h3>{item.ask}</h3>
              <p>{item.rationale}</p>
              {item.evidence ? <p className="evidence">Evidence: “{item.evidence}”</p> : null}
            </article>
          ))
        )}
      </div>

      <div className="subsection-spacer" />
      <div className="section-heading tight">
        <h3>Leverage to use</h3>
      </div>
      <div className="stack-list">
        {leveragePoints.length === 0 ? (
          <p className="muted-copy">No explicit leverage points were identified from the current input.</p>
        ) : (
          leveragePoints.map((item) => (
            <article className="insight-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              {item.evidence ? <p className="evidence">Evidence: “{item.evidence}”</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
};
