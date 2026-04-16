import type { PreferredTone, RiskTolerance } from '../../shared/types';

export type PrioritiesFormValues = {
  topGoalsText: string;
  minimumAcceptableConditionsText: string;
  nonNegotiablesText: string;
  preferredTone: PreferredTone;
  riskTolerance: RiskTolerance;
  contextNotes: string;
};

export type PrioritiesSectionProps = {
  values: PrioritiesFormValues;
  onChange: (field: keyof PrioritiesFormValues, value: string) => void;
};

export const PrioritiesSection = ({ values, onChange }: PrioritiesSectionProps) => {
  return (
    <section className="form-section">
      <div className="section-heading">
        <h3>Negotiation priorities</h3>
        <p>Tell Offer Lens what matters most so the strategy reflects your real constraints.</p>
      </div>

      <div className="field-grid single-column">
        <label className="field">
          <span>Top goals</span>
          <textarea
            name="topGoalsText"
            value={values.topGoalsText}
            onChange={(event) => onChange('topGoalsText', event.target.value)}
            placeholder="One per line — e.g. Increase base salary&#10;Clarify level scope&#10;Keep the relationship warm"
            rows={4}
          />
        </label>

        <label className="field">
          <span>Minimum acceptable conditions</span>
          <textarea
            name="minimumAcceptableConditionsText"
            value={values.minimumAcceptableConditionsText}
            onChange={(event) => onChange('minimumAcceptableConditionsText', event.target.value)}
            placeholder="One per line — e.g. Remote flexibility two days per week"
            rows={3}
          />
        </label>

        <label className="field">
          <span>Non-negotiables</span>
          <textarea
            name="nonNegotiablesText"
            value={values.nonNegotiablesText}
            onChange={(event) => onChange('nonNegotiablesText', event.target.value)}
            placeholder="One per line — e.g. No relocation before August"
            rows={3}
          />
        </label>
      </div>

      <div className="field-grid compact-grid">
        <label className="field">
          <span>Preferred tone</span>
          <select
            name="preferredTone"
            value={values.preferredTone}
            onChange={(event) => onChange('preferredTone', event.target.value)}
          >
            <option value="collaborative">Collaborative</option>
            <option value="confident">Confident</option>
            <option value="direct">Direct</option>
            <option value="warm">Warm</option>
          </select>
        </label>

        <label className="field">
          <span>Risk tolerance</span>
          <select
            name="riskTolerance"
            value={values.riskTolerance}
            onChange={(event) => onChange('riskTolerance', event.target.value)}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Context notes</span>
        <textarea
          name="contextNotes"
          value={values.contextNotes}
          onChange={(event) => onChange('contextNotes', event.target.value)}
          placeholder="Optional context — competing offers, timing pressure, visa needs, family constraints, or manager signals."
          rows={3}
        />
      </label>
    </section>
  );
};
