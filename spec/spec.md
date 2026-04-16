IDEATION OUTPUT
Title: Offer Lens
Description: AI turns a job offer and your priorities into a negotiation plan, risk scan, and email draft.

Spec Seed:
- What it does: Offer Lens helps candidates interpret job offers with more clarity. It extracts compensation terms, title/level implications, deadlines, leverage points, and possible risks, then proposes a negotiation plan and drafts the email to send.
- Who it's for: Candidates evaluating or negotiating job offers, especially in tech, startup, or knowledge-work roles.
- Core job: When a job offer feels high-stakes and fuzzy, I want a grounded negotiation strategy, so I can respond confidently instead of second-guessing every term.
- Current alternative: People compare salary/equity manually, ask friends for opinions, and draft negotiation emails from scratch under deadline pressure.
- Key differentiator: It combines offer interpretation, negotiation framing, risk analysis, and message drafting in one flow.
- AI integration: AI parses offer terms, identifies leverage and concerns, summarizes tradeoffs, suggests an ask order, and writes the negotiation email.
- Demo flow: Paste the offer; add your priorities; generate the analysis; inspect leverage/risks/tradeoffs; copy the email draft.
- Tech stack suggestion: React + TypeScript frontend, Node/Express backend, OpenRouter free model integration.
- Riskiest assumption: Users need trust and nuance, not overconfident advice; mitigate with confidence labels, explicit caveats, and evidence sections tied to the offer text.
Engagement hook: Paste a job offer and get your smartest negotiation plan in seconds.

Design Direction:
- Visual style: editorial dashboard
- Reference design system: Linear + Stripe-inspired clarity
- Color palette: #0F172A, #7C3AED, #14B8A6, #F8FAFC, #CBD5E1
- Font pairing: Space Grotesk + Inter
- Layout: single page scroll
- Key polish target: the negotiation-plan panel should feel premium, calm, and high-stakes without looking intimidating

Change name:
- offer-lens-launch
