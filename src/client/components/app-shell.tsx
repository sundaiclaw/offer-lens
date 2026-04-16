import type { ReactNode } from 'react';

export type AppShellProps = {
  left: ReactNode;
  right: ReactNode;
};

export const AppShell = ({ left, right }: AppShellProps) => {
  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Private career strategy desk</p>
          <h1>Offer Lens</h1>
          <p className="hero-copy">
            Paste a job offer, layer in your priorities, and move from written offer to grounded
            negotiation plan to sendable reply without losing the thread.
          </p>
        </div>
        <div className="hero-metrics" aria-label="product highlights">
          <div className="metric-card">
            <span className="metric-label">Output</span>
            <strong>Plan + draft</strong>
            <p>Recommended ask order, pressure points, and a concise email.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Trust</span>
            <strong>Evidence-first</strong>
            <p>Confidence labels, caveats, and offer excerpts keep the advice grounded.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Flow</span>
            <strong>Paste → inspect → reply</strong>
            <p>Built for quick, tactical decisions when timing pressure is real.</p>
          </div>
        </div>
      </header>

      <main className="workspace">
        <section className="column column-form">{left}</section>
        <section className="column column-results">{right}</section>
      </main>
    </div>
  );
};
