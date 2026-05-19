"use client";

import { ErrorFallback } from "@/components/ErrorFallback";

export default function EditApplicationError({
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
      title="Failed to load application"
      message="The application you're trying to edit could not be found or loaded."
      showBackButton
      backUrl="/applications"
    />
  );
}
