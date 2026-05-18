"use client";

import { JobApplication, ApplicationStatus } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Calendar, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const statusBadgeStyles: Record<ApplicationStatus, string> = {
  saved: "bg-gray-100 text-gray-700 border-gray-200",
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  "phone-screen": "bg-purple-50 text-purple-700 border-purple-200",
  interview: "bg-yellow-50 text-yellow-700 border-yellow-200",
  offer: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  withdrawn: "bg-gray-50 text-gray-500 border-gray-200",
};

const statusAccentColors: Record<ApplicationStatus, string> = {
  saved: "from-gray-400 to-gray-500",
  applied: "from-blue-400 to-blue-600",
  "phone-screen": "from-purple-400 to-purple-600",
  interview: "from-yellow-400 to-yellow-500",
  offer: "from-green-400 to-emerald-500",
  rejected: "from-red-400 to-red-600",
  withdrawn: "from-gray-300 to-gray-400",
};

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  className?: string;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
  className,
}: ApplicationCardProps) {
  const visibleTags = application.tags.slice(0, 3);
  const remainingTags = application.tags.length - 3;

  const formatStatusLabel = (status: ApplicationStatus) => {
    if (status === "phone-screen") return "Phone Screen";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "h-[3px] w-full bg-gradient-to-r",
          statusAccentColors[application.status],
        )}
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center font-semibold text-foreground border border-border/40">
                {application.company.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{application.company}</h3>
                <p className="text-xs text-muted-foreground">
                  {application.role}
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {application.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                <span className="capitalize">{application.workType}</span>
              </span>
            </div>

            {application.salary && (
              <div className="text-sm font-medium mt-1">
                {application.salary}
              </div>
            )}
            {application.appliedDate && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Applied:{" "}
                {new Date(application.appliedDate).toLocaleDateString()}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
              {remainingTags > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                  +{remainingTags}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={cn(
                "text-[11px] font-medium px-2.5 py-1 rounded-full border",
                statusBadgeStyles[application.status],
              )}
            >
              {formatStatusLabel(application.status)}
            </span>
            <div className="flex gap-1 items-center">
              <Select
                value={application.status}
                onValueChange={(value) =>
                  onStatusChange(application.id, value as ApplicationStatus)
                }
              >
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="phone-screen">Phone Screen</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(application)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(application.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {application.notes && (
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2 border-l-2 border-border pl-2.5 leading-relaxed">
            {application.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
