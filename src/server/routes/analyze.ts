import { Router } from 'express';

import { offerIntakeInputSchema } from '../../shared/schema';
import type { OfferAnalysisResponse, OfferIntakeInput } from '../../shared/types';
import { RequestValidationError } from '../lib/errors';
import { analyzeOffer as defaultAnalyzeOffer } from '../services/offer-analysis';

export type AnalyzeOfferHandler = (input: OfferIntakeInput) => Promise<OfferAnalysisResponse>;

export const createAnalyzeRouter = (deps: { analyzeOffer?: AnalyzeOfferHandler } = {}) => {
  const router = Router();
  const analyzeOffer = deps.analyzeOffer ?? defaultAnalyzeOffer;

  router.post('/', async (req, res, next) => {
    const parsed = offerIntakeInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(
        new RequestValidationError('Please review the highlighted offer inputs.', parsed.error.flatten()),
      );
    }

    try {
      const analysis = await analyzeOffer(parsed.data);
      return res.status(200).json(analysis);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
