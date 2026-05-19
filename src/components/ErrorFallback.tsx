// components/ErrorFallback.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong!",
  message,
  showBackButton = false,
  backUrl = "/",
}: ErrorFallbackProps) {
  const handleBack = () => {
    window.location.href = backUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
      <div className="rounded-full bg-red-100 p-3">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-red-600">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        {message || error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-3 mt-2">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        {showBackButton && (
          <Button onClick={handleBack} variant="outline">
            Go back
          </Button>
        )}
      </div>
    </div>
  );
}
