// app/applications/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-32 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}