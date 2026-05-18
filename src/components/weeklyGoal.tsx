// components/weekly-goal-widget.tsx
import { cn } from "@/lib/utils";

interface WeeklyGoalWidgetProps {
  goal: number;
  progress: number;
  className?: string;
}

export function WeeklyGoalWidget({ goal, progress, className }: WeeklyGoalWidgetProps) {
  const percentage = Math.min(100, (progress / goal) * 100);
  
  const getColor = () => {
    if (percentage >= 100) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-gray-500";
  };
  
  const getStrokeColor = () => {
    if (percentage >= 100) return "#22c55e";
    if (percentage >= 50) return "#eab308";
    return "#9ca3af";
  };
  
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-xl font-bold", getColor())}>{progress}</span>
          <span className="text-xs text-muted-foreground">/ {goal}</span>
        </div>
      </div>
      <p className="text-xs text-center mt-2 text-muted-foreground">
        Weekly Goal
      </p>
    </div>
  );
}