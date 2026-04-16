export const EmptyState = () => {
  return (
    <section className="panel-card empty-state">
      <p className="eyebrow">Ready when you are</p>
      <h2>Paste the written offer to open your decision brief</h2>
      <p className="empty-state-copy">
        Offer Lens works best when you include the full offer text, any deadline pressure, and the
        priorities you do not want to lose in negotiation.
      </p>

      <div className="empty-state-grid">
        <div className="empty-state-note">
          <span className="metric-label">Best inputs</span>
          <ul>
            <li>The full offer email or doc, not just a compensation summary.</li>
            <li>Decision timing, recruiter notes, and any competing-offer pressure.</li>
            <li>Your top goals, minimum acceptable conditions, and non-negotiables.</li>
          </ul>
        </div>

        <div className="empty-state-note">
          <span className="metric-label">You’ll get</span>
          <ul>
            <li>Extracted terms with evidence from the offer.</li>
            <li>Recommended asks, leverage points, and risks to watch.</li>
            <li>Tradeoffs plus a concise email draft you can send fast.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
