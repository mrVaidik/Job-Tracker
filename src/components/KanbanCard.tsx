// app/applications/KanbanCard.tsx

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

import { useDraggable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────

interface KanbanCardProps {
  application: JobApplication;

  onEdit: (application: JobApplication) => void;

  onDelete: (id: string) => void;

  onStatusChange: (id: string, status: ApplicationStatus) => void;

  className?: string;
}

// ─────────────────────────────────────────────

export function KanbanCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
  className,
}: KanbanCardProps) {
  const visibleTags = application.tags.slice(0, 3);

  const remainingTags = application.tags.length - 3;

  // ─────────────────────────────────────────────
  // DRAGGABLE
  // ─────────────────────────────────────────────

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: application.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // ─────────────────────────────────────────────

  const formatStatusLabel = (status: ApplicationStatus) => {
    if (status === "phone-screen") return "Phone Screen";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // ─────────────────────────────────────────────

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        `
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border/50
        bg-background
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
        cursor-grab
        active:cursor-grabbing
        `,
        isDragging && "opacity-50 rotate-1 scale-105 shadow-2xl z-50",
        className,
      )}
    >
      {/* TOP BAR */}

      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r",
          statusAccentColors[application.status],
        )}
      />

      {/* CONTENT */}

      <CardContent className="p-5">
        {/* HEADER */}

        <div className="flex items-start gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-muted flex items-center justify-center text-foreground font-semibold text-lg border border-border/40">
            {application.company.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-[15px] text-foreground truncate">
                {application.company}
              </h3>

              <span
                className={cn(
                  "shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border",
                  statusBadgeStyles[application.status],
                )}
              >
                {formatStatusLabel(application.status)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-0.5">
              {application.role}
            </p>
          </div>
        </div>

        {/* META */}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />

            <span>{application.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />

            <span className="capitalize">{application.workType}</span>
          </div>

          {application.appliedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />

              <span>
                {new Date(application.appliedDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* TAGS */}

        {application.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
              >
                {tag}
              </span>
            ))}

            {remainingTags > 0 && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                +{remainingTags}
              </span>
            )}
          </div>
        )}

        {/* NOTES */}

        {application.notes && (
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2 border-l-2 border-border pl-2.5 leading-relaxed">
            {application.notes}
          </p>
        )}

        {/* FOOTER */}

        <div className="mt-4 pt-3 border-t border-border/50 flex flex-col gap-2">
          {/* BUTTONS */}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1.5"
              onClick={() => onEdit(application)}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
              onClick={() => onDelete(application.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>

          {/* STATUS */}

          <Select
            value={application.status}
            onValueChange={(value) =>
              onStatusChange(application.id, value as ApplicationStatus)
            }
          >
            <SelectTrigger className="w-full h-8 rounded-lg text-xs border-border/60">
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
        </div>
      </CardContent>
    </Card>
  );
}
