"use client";

import { ErrorFallback } from "@/components/ErrorFallback";

export default function InterviewsError({
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
      title="Could not load interviews"
      message="Failed to fetch your interview schedule."
    />
  );
}
