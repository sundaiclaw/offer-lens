import { useEffect, useRef, useState } from 'react';

export type CopyButtonProps = {
  text: string;
  label?: string;
};

export const CopyButton = ({ text, label = 'Copy draft' }: CopyButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const timeoutRef = useRef<number | null>(null);

  const scheduleReset = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus('idle');
      timeoutRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('success');
      scheduleReset();
    } catch {
      setStatus('error');
      scheduleReset();
    }
  };

  return (
    <button
      aria-live="polite"
      className={`secondary-button copy-button copy-button-${status}`}
      type="button"
      onClick={handleCopy}
    >
      {status === 'success' ? 'Copied' : status === 'error' ? 'Copy failed' : label}
    </button>
  );
};
