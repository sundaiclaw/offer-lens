import type { RiskNote } from '../../shared/types';

export const RisksCard = ({ risks }: { risks: RiskNote[] }) => {
  return (
    <section className="panel-card">
      <div className="section-heading tight">
        <p className="eyebrow">Risk scan</p>
        <h2>Pressure points and downsides</h2>
      </div>
      {risks.length === 0 ? (
        <p className="muted-copy">No specific risks were flagged. Confirm the offer still has enough detail before relying on that.</p>
      ) : (
        <div className="stack-list">
          {risks.map((risk) => (
            <article className="insight-card" key={`${risk.title}-${risk.detail}`}>
              <div className="insight-header">
                <h3>{risk.title}</h3>
                <span className={`severity-pill severity-${risk.severity}`}>{risk.severity}</span>
              </div>
              <p>{risk.detail}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
