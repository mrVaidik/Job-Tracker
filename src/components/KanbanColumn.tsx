"use client";

import { JobApplication, ApplicationStatus } from "@/types/job";

import { KanbanCard } from "./KanbanCard";

import { cn } from "@/lib/utils";

import { useDroppable } from "@dnd-kit/core";

// ─────────────────────────────────────────────

interface KanbanColumnProps {
  status: ApplicationStatus;

  applications: JobApplication[];

  onCardEdit: (application: JobApplication) => void;

  onCardDelete: (id: string) => void;

  onStatusChange: (id: string, status: ApplicationStatus) => void;

  className?: string;
}

// ─────────────────────────────────────────────

const statusLabels: Record<ApplicationStatus, string> = {
  saved: "Saved",

  applied: "Applied",

  "phone-screen": "Phone Screen",

  interview: "Interview",

  offer: "Offer",

  rejected: "Rejected",

  withdrawn: "Withdrawn",
};

// ─────────────────────────────────────────────

export function KanbanColumn({
  status,
  applications,
  onCardEdit,
  onCardDelete,
  onStatusChange,
  className,
}: KanbanColumnProps) {
  // ─────────────────────────────────────────────
  // DROPPABLE
  // ─────────────────────────────────────────────

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // ─────────────────────────────────────────────

  return (
    <div
      ref={setNodeRef}
      className={cn(
        `
        flex
        flex-col
        min-w-[360px]
        max-w-[360px]
        rounded-3xl
        border
        bg-muted/30
        transition-all
        duration-300
        `,
        isOver && "ring-2 ring-blue-500 bg-blue-50/50 scale-[1.01]",
        className,
      )}
    >
      {/* HEADER */}

      <div className="sticky top-0 z-10 rounded-t-3xl border-b bg-background/80 backdrop-blur px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{statusLabels[status]}</h3>

            <p className="text-xs text-muted-foreground mt-1">
              {applications.length} applications
            </p>
          </div>

          <div className="h-8 min-w-8 rounded-full bg-background border px-2 flex items-center justify-center text-xs font-semibold">
            {applications.length}
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex-1 p-4 space-y-4 min-h-[500px]">
        {applications.length === 0 ? (
          <div
            className="
            flex
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            py-10
            text-sm
            text-muted-foreground
          "
          >
            Drop here
          </div>
        ) : (
          applications.map((app) => (
            <KanbanCard
              key={app.id}
              application={app}
              onEdit={onCardEdit}
              onDelete={onCardDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
