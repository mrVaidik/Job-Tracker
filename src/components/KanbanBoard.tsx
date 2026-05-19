"use client";
// components/applications/KanbanBoard.tsx

import { useState, useCallback } from "react";
import { JobApplication, ApplicationStatus } from "@/types/job";
import KanbanColumn from "@/components/KanBanColumn";

const ALL_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "phone-screen",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

interface KanbanBoardProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export default function KanbanBoard({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] =
    useState<ApplicationStatus | null>(null);

  const handleDragStart = useCallback((id: string) => setDraggingId(id), []);
  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverStatus(null);
  }, []);
  const handleDragOver = useCallback(
    (s: ApplicationStatus) => setDragOverStatus(s),
    [],
  );

  const handleDrop = useCallback(
    (status: ApplicationStatus) => {
      if (draggingId) {
        const app = applications.find((a) => a.id === draggingId);
        if (app && app.status !== status) onStatusChange(draggingId, status);
      }
      setDraggingId(null);
      setDragOverStatus(null);
    },
    [draggingId, applications, onStatusChange],
  );

  const grouped = ALL_STATUSES.reduce<
    Record<ApplicationStatus, JobApplication[]>
  >(
    (acc, s) => {
      acc[s] = applications.filter((a) => a.status === s);
      return acc;
    },
    {} as Record<ApplicationStatus, JobApplication[]>,
  );

  return (
    <div className="flex gap-4 overflow-x-auto h-full px-6 py-5 pb-8 items-start">
      {ALL_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          applications={grouped[status]}
          onCardEdit={onEdit}
          onCardDelete={onDelete}
          onStatusChange={onStatusChange}
          draggingId={draggingId}
          isDropTarget={dragOverStatus === status}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
