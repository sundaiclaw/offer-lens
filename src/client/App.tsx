import { useEffect, useRef } from 'react';

import { AnalysisPanel } from './components/analysis-panel';
import { AppShell } from './components/app-shell';
import { OfferIntakeForm } from './components/offer-intake-form';
import { useOfferAnalysis } from './hooks/use-offer-analysis';

export const App = () => {
  const { error, isLoading, result, submitOffer } = useOfferAnalysis();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading || !window.matchMedia('(max-width: 1080px)').matches) {
      return;
    }

    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isLoading]);

  return (
    <AppShell
      left={<OfferIntakeForm isSubmitting={isLoading} onSubmit={submitOffer} />}
      right={
        <div ref={resultsRef}>
          <AnalysisPanel error={error} isLoading={isLoading} result={result} />
        </div>
      }
    />
  );
};
