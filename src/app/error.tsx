'use client';

import ServerDown from '@/global/components/server-down-error/server-down-error';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  const handleRetry = () => {
    // Refresh the page or redirect to home
    window.location.reload();
  };

  return (
    <ServerDown
      onRetry={handleRetry}
      message="We're experiencing technical difficulties and are working to resolve them quickly. Thank you for your patience."
    />
  );
}
