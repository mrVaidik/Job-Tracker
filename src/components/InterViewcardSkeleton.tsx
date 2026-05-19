// components/interview-card-skeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface InterviewCardSkeletonProps {
  count?: number;
}

export function InterviewCardSkeleton({
  count = 3,
}: InterviewCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-40 rounded-md" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-end gap-3">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
