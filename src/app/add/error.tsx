"use client";

import { ErrorFallback } from "@/components/ErrorFallback";

export default function AddApplicationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Could not load the form"
      message="We couldn't load the application form. Please refresh."
    />
  );
}
