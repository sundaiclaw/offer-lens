import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { getErrorResponse } from './lib/errors';
import { createAnalyzeRouter, type AnalyzeOfferHandler } from './routes/analyze';

export const createApp = (deps: { analyzeOffer?: AnalyzeOfferHandler } = {}) => {
  const app = express();
  const clientDistDir = path.resolve(process.cwd(), 'dist/client');

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api/analyze', createAnalyzeRouter(deps));

  if (existsSync(clientDistDir)) {
    app.use(express.static(clientDistDir, { index: false }));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }

      return res.sendFile(path.join(clientDistDir, 'index.html'));
    });
  }

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const { statusCode, body } = getErrorResponse(error);
    res.status(statusCode).json({ error: body });
  });

  return app;
};
