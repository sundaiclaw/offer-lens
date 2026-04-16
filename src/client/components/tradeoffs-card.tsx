import type { Tradeoff } from '../../shared/types';

export const TradeoffsCard = ({ tradeoffs }: { tradeoffs: Tradeoff[] }) => {
  return (
    <section className="panel-card">
      <div className="section-heading tight">
        <p className="eyebrow">Tradeoffs</p>
        <h2>What to push, accept, or defer</h2>
      </div>
      {tradeoffs.length === 0 ? (
        <p className="muted-copy">No explicit tradeoffs were returned. Use the caveats to judge how much context may be missing.</p>
      ) : (
        <div className="stack-list">
          {tradeoffs.map((tradeoff) => (
            <article className="insight-card" key={`${tradeoff.title}-${tradeoff.choice}`}>
              <h3>{tradeoff.title}</h3>
              <p className="tradeoff-choice">{tradeoff.choice}</p>
              <div className="tradeoff-grid">
                <div>
                  <span className="metric-label">Upside</span>
                  <p>{tradeoff.upside}</p>
                </div>
                <div>
                  <span className="metric-label">Downside</span>
                  <p>{tradeoff.downside}</p>
                </div>
              </div>
              {tradeoff.recommendation ? (
                <p className="recommendation">Recommendation: {tradeoff.recommendation}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
