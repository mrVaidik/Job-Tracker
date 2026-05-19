
import { ApplicationStatus } from "@/types/job";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

interface StatusPipelineProps {
  currentStatus: ApplicationStatus;
  className?: string;
}

const pipelineStatuses: ApplicationStatus[] = ["saved", "applied", "phone-screen", "interview", "offer"];
const terminalStatuses: ApplicationStatus[] = ["rejected", "withdrawn"];

export function StatusPipeline({ currentStatus, className }: StatusPipelineProps) {
  if (terminalStatuses.includes(currentStatus)) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div className="h-full w-full bg-red-500 rounded-full" />
        </div>
        <span className="text-sm font-medium capitalize text-red-500">
          {currentStatus}
        </span>
      </div>
    );
  }
  
  const currentIndex = pipelineStatuses.indexOf(currentStatus);
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {pipelineStatuses.map((status, idx) => {
        const isCompleted = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        
        return (
          <div key={status} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                isCurrent && "ring-2 ring-green-500 ring-offset-2"
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs mt-1 capitalize hidden sm:inline">{status.replace("-", " ")}</span>
            </div>
            {idx < pipelineStatuses.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-1",
                idx < currentIndex ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}