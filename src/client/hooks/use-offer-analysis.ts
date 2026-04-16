import { useCallback, useState } from 'react';

import type { OfferAnalysisResponse, OfferIntakeInput } from '../../shared/types';
import { ApiError, analyzeOfferRequest } from '../lib/api';

export const useOfferAnalysis = () => {
  const [result, setResult] = useState<OfferAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitOffer = useCallback(async (input: OfferIntakeInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeOfferRequest(input);
      setResult(analysis);
    } catch (caught) {
      const message =
        caught instanceof ApiError
          ? caught.message
          : 'We hit a temporary issue while analyzing the offer. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    result,
    error,
    isLoading,
    submitOffer,
  };
};
