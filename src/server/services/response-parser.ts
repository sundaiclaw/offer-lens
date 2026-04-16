import {
  DEFAULT_ANALYSIS_DISCLAIMER,
  DEFAULT_CAVEAT,
  offerAnalysisResponseSchema,
} from '../../shared/schema';
import type { OfferAnalysisResponse } from '../../shared/types';
import { AIResponseParseError } from '../lib/errors';

const deriveConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.76) {
    return 'High' as const;
  }

  if (confidence >= 0.45) {
    return 'Moderate' as const;
  }

  return 'Low' as const;
};

const asTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const parseConfidence = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(1, Math.max(0, value));
  }

  if (typeof value === 'string') {
    const normalized = value.trim().replace('%', '');
    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) {
      return parsed > 1 ? Math.min(1, parsed / 100) : Math.min(1, Math.max(0, parsed));
    }
  }

  return undefined;
};

const toStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }

      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        return asTrimmedString(record.value ?? record.text ?? record.detail ?? record.message);
      }

      return undefined;
    })
    .filter((item): item is string => Boolean(item));
};

const toRecordArray = (value: unknown): Array<Record<string, unknown>> => {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([label, item]) => {
      if (item && typeof item === 'object') {
        return { label, ...(item as Record<string, unknown>) };
      }

      return { label, value: item };
    });
  }

  return [];
};

const normalizeExtractedTerms = (value: unknown) =>
  toRecordArray(value).map((item, index) => ({
    label: asTrimmedString(item.label ?? item.name ?? `Term ${index + 1}`) ?? `Term ${index + 1}`,
    value: asTrimmedString(item.value ?? item.amount ?? item.term ?? item.detail) ?? 'Not specified',
    evidence: asTrimmedString(item.evidence ?? item.source ?? item.quote),
  }));

const normalizeRecommendedAsks = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'string') {
          return {
            priority: index + 1,
            ask: item.trim(),
            rationale: 'Validate this ask against the written offer before sending.',
            evidence: undefined,
          };
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const ask = asTrimmedString(record.ask ?? record.request ?? record.title ?? record.value);
          if (!ask) {
            return undefined;
          }

          return {
            priority:
              typeof record.priority === 'number' && Number.isFinite(record.priority)
                ? record.priority
                : index + 1,
            ask,
            rationale:
              asTrimmedString(record.rationale ?? record.reason ?? record.detail) ??
              'Validate this ask against the written offer before sending.',
            evidence: asTrimmedString(record.evidence ?? record.source ?? record.quote),
          };
        }

        return undefined;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  return [];
};

const normalizeLeveragePoints = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'string') {
          const detail = item.trim();
          return detail
            ? {
                title: `Leverage ${index + 1}`,
                detail,
                evidence: undefined,
              }
            : undefined;
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const detail = asTrimmedString(record.detail ?? record.description ?? record.rationale ?? record.value);
          if (!detail) {
            return undefined;
          }

          return {
            title: asTrimmedString(record.title ?? record.label ?? record.point) ?? `Leverage ${index + 1}`,
            detail,
            evidence: asTrimmedString(record.evidence ?? record.source ?? record.quote),
          };
        }

        return undefined;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  return [];
};

const normalizeRiskNotes = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'string') {
          const detail = item.trim();
          return detail
            ? {
                title: `Risk ${index + 1}`,
                detail,
                severity: 'medium' as const,
              }
            : undefined;
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const detail = asTrimmedString(record.detail ?? record.description ?? record.reason ?? record.value);
          if (!detail) {
            return undefined;
          }

          const severity = asTrimmedString(record.severity)?.toLowerCase();
          return {
            title: asTrimmedString(record.title ?? record.label ?? record.risk) ?? `Risk ${index + 1}`,
            detail,
            severity: severity === 'low' || severity === 'medium' || severity === 'high' ? severity : 'medium',
          };
        }

        return undefined;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  return [];
};

const normalizeTradeoffs = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'string') {
          const choice = item.trim();
          return choice
            ? {
                title: `Tradeoff ${index + 1}`,
                choice,
                upside: 'Potential upside requires manual review.',
                downside: 'Potential downside requires manual review.',
                recommendation: undefined,
              }
            : undefined;
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const choice = asTrimmedString(record.choice ?? record.tradeoff ?? record.option ?? record.title);
          if (!choice) {
            return undefined;
          }

          return {
            title: asTrimmedString(record.title ?? record.label) ?? `Tradeoff ${index + 1}`,
            choice,
            upside: asTrimmedString(record.upside ?? record.pro) ?? 'Potential upside requires manual review.',
            downside: asTrimmedString(record.downside ?? record.con) ?? 'Potential downside requires manual review.',
            recommendation: asTrimmedString(record.recommendation ?? record.guidance),
          };
        }

        return undefined;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  return [];
};

const normalizeEmailDraft = (value: unknown) => {
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const subject = asTrimmedString(record.subject) ?? 'Follow-up on offer details';
    const body =
      asTrimmedString(record.body) ??
      'Hi there,\n\nThank you for the offer. I’m excited about the role and would love to discuss a few details before I sign.\n\nBest,\nYour Name';

    return { subject, body };
  }

  const body = asTrimmedString(value);
  return {
    subject: 'Follow-up on offer details',
    body:
      body ??
      'Hi there,\n\nThank you for the offer. I’m excited about the role and would love to discuss a few details before I sign.\n\nBest,\nYour Name',
  };
};

export const stripMarkdownCodeFences = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('```')) {
    return trimmed;
  }

  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
};

export const extractJsonObject = (raw: string): unknown => {
  const cleaned = stripMarkdownCodeFences(raw);

  try {
    return JSON.parse(cleaned);
  } catch {
    const startIndex = cleaned.indexOf('{');
    const endIndex = cleaned.lastIndexOf('}');

    if (startIndex === -1 || endIndex <= startIndex) {
      throw new AIResponseParseError('The AI response did not contain a JSON object.');
    }

    try {
      return JSON.parse(cleaned.slice(startIndex, endIndex + 1));
    } catch {
      throw new AIResponseParseError('The AI response JSON could not be parsed.');
    }
  }
};

export const normalizeOfferAnalysisPayload = (payload: unknown): OfferAnalysisResponse => {
  if (!payload || typeof payload !== 'object') {
    throw new AIResponseParseError('The AI response was empty or invalid.');
  }

  const record = payload as Record<string, unknown>;
  const confidence = parseConfidence(record.confidence ?? record.confidenceScore) ?? 0.55;

  const recommendedAsks = normalizeRecommendedAsks(
    record.recommendedAsks ?? record.askStrategy ?? record.asks,
  );
  const riskNotes = normalizeRiskNotes(record.riskNotes ?? record.risks);

  const normalized = {
    summary:
      asTrimmedString(record.summary) ??
      recommendedAsks[0]?.rationale ??
      riskNotes[0]?.detail ??
      'Review the offer carefully, clarify ambiguous terms, and lead with the highest-value ask first.',
    extractedTerms: normalizeExtractedTerms(record.extractedTerms ?? record.offerTerms ?? record.terms),
    recommendedAsks,
    leveragePoints: normalizeLeveragePoints(record.leveragePoints ?? record.leverage),
    riskNotes,
    tradeoffs: normalizeTradeoffs(record.tradeoffs ?? record.tradeOffs),
    emailDraft: normalizeEmailDraft(record.emailDraft ?? record.messageDraft ?? record.email),
    confidence,
    confidenceLabel: asTrimmedString(record.confidenceLabel) ?? deriveConfidenceLabel(confidence),
    caveats: toStringList(record.caveats).slice(0, 3),
    disclaimer: asTrimmedString(record.disclaimer) ?? DEFAULT_ANALYSIS_DISCLAIMER,
  };

  if (normalized.caveats.length === 0) {
    normalized.caveats = [DEFAULT_CAVEAT];
  }

  return offerAnalysisResponseSchema.parse(normalized);
};

export const parseOfferAnalysisResponse = (raw: string): OfferAnalysisResponse => {
  const payload = extractJsonObject(raw);
  return normalizeOfferAnalysisPayload(payload);
};
