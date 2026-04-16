# Offer Lens

Offer Lens turns a job offer and your priorities into a negotiation plan, risk scan, tradeoff summary, and a sendable email draft.

## What it does

- Extracts concrete offer terms from pasted text and optional structured overrides
- Maps the offer against your priorities and non-negotiables
- Returns recommended asks, leverage points, risks, tradeoffs, and rationale
- Generates a concise recruiter or hiring-manager email you can copy in one click

## Stack

- React + TypeScript + Vite SPA
- Express + TypeScript API
- Shared Zod schemas for request and response validation
- OpenRouter via the official `openai` SDK

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your OpenRouter key:

   ```bash
   cp .env.example .env
   ```

3. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

   - Vite app: `http://localhost:5173`
   - API + health endpoint: `http://localhost:8080`

## Required environment variables

- `OPENROUTER_API_KEY` - required for live AI analysis
- `OPENROUTER_MODEL` - optional override, defaults to `openai/gpt-4.1-mini`
- `OPENROUTER_SITE_URL` - optional OpenRouter referer header
- `OPENROUTER_SITE_NAME` - optional OpenRouter title header
- `PORT` - optional API port, defaults to `8080`

## Scripts

- `npm run dev` - run client and server in watch mode
- `npm run build` - build the server and SPA into `dist/`
- `npm run start` - serve the production build
- `npm run test` - run automated tests
- `npm run lint` - run ESLint

## Production build

```bash
npm run build
npm run start
```

The Express server serves the built SPA from `dist/client` and exposes `GET /health`.

## Security notes

- No secrets are hardcoded in the repository
- The app does not enable permissive CORS; in development Vite proxies API requests to the local Express server
- Offer Lens provides decision support only and should not be treated as legal, tax, or financial advice
