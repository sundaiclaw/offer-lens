import { useState } from 'react';

import { offerIntakeInputSchema } from '../../shared/schema';
import type { OfferIntakeInput, PreferredTone, RiskTolerance, WorkMode } from '../../shared/types';
import { PrioritiesSection, type PrioritiesFormValues } from './priorities-section';

export type OfferIntakeFormProps = {
  isSubmitting: boolean;
  onSubmit: (input: OfferIntakeInput) => Promise<void> | void;
};

type OfferFormState = {
  rawOfferText: string;
  company: string;
  roleTitle: string;
  level: string;
  location: string;
  workMode: WorkMode;
  employmentType: string;
  baseSalary: string;
  bonus: string;
  equity: string;
  signOn: string;
  startDate: string;
  deadline: string;
  recruiterNotes: string;
  constraints: string;
} & PrioritiesFormValues;

const initialState: OfferFormState = {
  rawOfferText: '',
  company: '',
  roleTitle: '',
  level: '',
  location: '',
  workMode: 'unknown',
  employmentType: '',
  baseSalary: '',
  bonus: '',
  equity: '',
  signOn: '',
  startDate: '',
  deadline: '',
  recruiterNotes: '',
  constraints: '',
  topGoalsText: '',
  minimumAcceptableConditionsText: '',
  nonNegotiablesText: '',
  preferredTone: 'collaborative',
  riskTolerance: 'moderate',
  contextNotes: '',
};

const splitLines = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const buildPayload = (state: OfferFormState): OfferIntakeInput => ({
  rawOfferText: state.rawOfferText,
  offerDetails: {
    company: state.company,
    roleTitle: state.roleTitle,
    level: state.level,
    location: state.location,
    workMode: state.workMode,
    employmentType: state.employmentType,
    baseSalary: state.baseSalary,
    bonus: state.bonus,
    equity: state.equity,
    signOn: state.signOn,
    startDate: state.startDate,
    deadline: state.deadline,
    recruiterNotes: state.recruiterNotes,
    constraints: state.constraints,
  },
  priorities: {
    topGoals: splitLines(state.topGoalsText),
    minimumAcceptableConditions: splitLines(state.minimumAcceptableConditionsText),
    nonNegotiables: splitLines(state.nonNegotiablesText),
    preferredTone: state.preferredTone as PreferredTone,
    riskTolerance: state.riskTolerance as RiskTolerance,
    contextNotes: state.contextNotes,
  },
});

export const OfferIntakeForm = ({ isSubmitting, onSubmit }: OfferIntakeFormProps) => {
  const [values, setValues] = useState<OfferFormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof OfferFormState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = buildPayload(values);
    const parsed = offerIntakeInputSchema.safeParse(payload);

    if (!parsed.success) {
      const nextErrors = parsed.error.issues.reduce<Record<string, string>>((accumulator, issue) => {
        const key = issue.path.join('.');
        if (!accumulator[key]) {
          accumulator[key] = issue.message;
        }
        return accumulator;
      }, {});

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form aria-busy={isSubmitting} className="panel-card intake-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <p className="eyebrow">Offer input</p>
        <h2>Paste the full offer first</h2>
        <p>
          Include the written offer, recruiter notes, or key terms you want analyzed. Structured
          fields below can clarify missing details.
        </p>
      </div>

      <label className="field">
        <span>Offer text</span>
        <textarea
          name="rawOfferText"
          value={values.rawOfferText}
          onChange={(event) => handleFieldChange('rawOfferText', event.target.value)}
          placeholder="Paste the offer email, compensation breakdown, deadlines, and any constraints here."
          rows={10}
          aria-invalid={Boolean(errors.rawOfferText)}
        />
        {errors.rawOfferText ? <small className="field-error">{errors.rawOfferText}</small> : null}
      </label>

      <section className="form-section">
        <div className="section-heading">
          <h3>Structured offer details</h3>
          <p>Optional overrides help the analysis stay accurate when the pasted text is messy.</p>
        </div>

        <div className="field-grid compact-grid">
          <label className="field">
            <span>Company</span>
            <input
              name="company"
              value={values.company}
              onChange={(event) => handleFieldChange('company', event.target.value)}
              placeholder="Acme AI"
            />
          </label>
          <label className="field">
            <span>Role / title</span>
            <input
              name="roleTitle"
              value={values.roleTitle}
              onChange={(event) => handleFieldChange('roleTitle', event.target.value)}
              placeholder="Senior Product Manager"
            />
          </label>
          <label className="field">
            <span>Level</span>
            <input
              name="level"
              value={values.level}
              onChange={(event) => handleFieldChange('level', event.target.value)}
              placeholder="L5"
            />
          </label>
          <label className="field">
            <span>Employment type</span>
            <input
              name="employmentType"
              value={values.employmentType}
              onChange={(event) => handleFieldChange('employmentType', event.target.value)}
              placeholder="Full-time"
            />
          </label>
          <label className="field">
            <span>Base salary</span>
            <input
              name="baseSalary"
              value={values.baseSalary}
              onChange={(event) => handleFieldChange('baseSalary', event.target.value)}
              placeholder="$185,000"
            />
          </label>
          <label className="field">
            <span>Bonus</span>
            <input
              name="bonus"
              value={values.bonus}
              onChange={(event) => handleFieldChange('bonus', event.target.value)}
              placeholder="15% target"
            />
          </label>
          <label className="field">
            <span>Equity</span>
            <input
              name="equity"
              value={values.equity}
              onChange={(event) => handleFieldChange('equity', event.target.value)}
              placeholder="0.18% over 4 years"
            />
          </label>
          <label className="field">
            <span>Sign-on</span>
            <input
              name="signOn"
              value={values.signOn}
              onChange={(event) => handleFieldChange('signOn', event.target.value)}
              placeholder="$25,000"
            />
          </label>
          <label className="field">
            <span>Start date</span>
            <input
              name="startDate"
              value={values.startDate}
              onChange={(event) => handleFieldChange('startDate', event.target.value)}
              placeholder="June 10, 2026"
            />
          </label>
          <label className="field">
            <span>Decision deadline</span>
            <input
              name="deadline"
              value={values.deadline}
              onChange={(event) => handleFieldChange('deadline', event.target.value)}
              placeholder="Friday at 5pm PT"
            />
          </label>
          <label className="field">
            <span>Location</span>
            <input
              name="location"
              value={values.location}
              onChange={(event) => handleFieldChange('location', event.target.value)}
              placeholder="San Francisco, CA"
            />
          </label>
          <label className="field">
            <span>Work mode</span>
            <select
              name="workMode"
              value={values.workMode}
              onChange={(event) => handleFieldChange('workMode', event.target.value)}
            >
              <option value="unknown">Not specified</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Recruiter notes</span>
          <textarea
            name="recruiterNotes"
            value={values.recruiterNotes}
            onChange={(event) => handleFieldChange('recruiterNotes', event.target.value)}
            placeholder="Optional notes from calls or follow-ups."
            rows={3}
          />
        </label>

        <label className="field">
          <span>Constraints or special circumstances</span>
          <textarea
            name="constraints"
            value={values.constraints}
            onChange={(event) => handleFieldChange('constraints', event.target.value)}
            placeholder="Optional constraints such as relocation timing, visa limits, childcare, or competing deadlines."
            rows={3}
          />
        </label>
      </section>

      <PrioritiesSection values={values} onChange={handleFieldChange} />

      <div className="form-footer">
        <p aria-live="polite" className="helper-copy">
          {isSubmitting
            ? 'Reviewing compensation, timing, leverage, and draft language…'
            : 'Your data is sent only for analysis during this session; no account is required.'}
        </p>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="button-content">
              <span aria-hidden="true" className="button-spinner" />
              <span>Analyzing offer…</span>
            </span>
          ) : (
            'Generate negotiation plan'
          )}
        </button>
      </div>
    </form>
  );
};
