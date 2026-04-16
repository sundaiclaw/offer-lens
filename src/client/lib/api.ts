import { offerAnalysisResponseSchema } from '../../shared/schema';
import type { OfferAnalysisResponse, OfferIntakeInput } from '../../shared/types';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getApiErrorMessage = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const maybeError = (payload as { error?: { message?: unknown } }).error;
  return typeof maybeError?.message === 'string' ? maybeError.message : undefined;
};

export const analyzeOfferRequest = async (input: OfferIntakeInput): Promise<OfferAnalysisResponse> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const responseJson = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(responseJson) ?? 'We could not analyze the offer right now.');
  }

  return offerAnalysisResponseSchema.parse(responseJson);
};
