// components/interview-card.tsx
import { Interview } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, cn } from "@/lib/utils";
import { Calendar, Clock, User, FileText, AlertCircle, Edit, Trash2 } from "lucide-react";

interface InterviewCardProps {
  interview: Interview;
  onEdit: (interview: Interview) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function InterviewCard({ interview, onEdit, onDelete, className }: InterviewCardProps) {
  const isOverdue = new Date(interview.scheduledAt) < new Date() && interview.outcome === "pending";
  
  const outcomeColors = {
    pass: "bg-green-500",
    fail: "bg-red-500",
    pending: "bg-gray-500",
  };
  
  return (
    <Card className={cn("hover:shadow-md transition-shadow", isOverdue && "border-red-300 bg-red-50/30", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">Round {interview.round}</h3>
              <Badge variant="outline" className="capitalize">
                {interview.type}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Overdue
                </Badge>
              )}
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDateTime(interview.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{interview.duration} minutes</span>
              </div>
              {interview.interviewerName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{interview.interviewerName}</span>
                </div>
              )}
              {interview.notes && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <FileText className="h-3 w-3 mt-0.5" />
                  <span className="text-sm">{interview.notes}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {interview.outcome && (
              <Badge className={cn("text-white", outcomeColors[interview.outcome])}>
                {interview.outcome}
              </Badge>
            )}
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(interview)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(interview.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}