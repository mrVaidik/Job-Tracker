"use client";

import { JobApplication, ApplicationStatus } from "@/types/job";
import ApplicationCard from "@/components/ApplicationCard";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string }> = {
  saved: { label: "Saved" },
  applied: { label: "Applied" },
  "phone-screen": { label: "Phone Screen" },
  interview: { label: "Interview" },
  offer: { label: "Offer" },
  rejected: { label: "Rejected" },
  withdrawn: { label: "Withdrawn" },
};

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: JobApplication[];
  onCardEdit: (application: JobApplication) => void;
  onCardDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  className?: string;

  draggingId: string | null;
  isDropTarget: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (status: ApplicationStatus) => void;
  onDrop: (status: ApplicationStatus) => void;
}

export default function KanbanColumn({
  status,
  applications,
  onCardEdit,
  onCardDelete,
  onStatusChange,
  className = "",
  draggingId,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const label = STATUS_CONFIG[status].label;

  return (
    <div
      className={`flex-shrink-0 w-[300px] flex flex-col rounded-2xl border transition-all duration-150 ${
        isDropTarget
          ? "border-gray-400 bg-gray-50 shadow-sm"
          : "border-gray-200 bg-white"
      } ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(status);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(status);
      }}
    >
      {}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-700">
          {applications.length}
        </span>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 min-h-[80px] max-h-[calc(100vh-220px)]">
        {applications.length === 0 ? (
          <DropZone isActive={isDropTarget} />
        ) : (
          <>
            {applications.map((app) => (
              <DraggableCard
                key={app.id}
                application={app}
                onEdit={onCardEdit}
                onDelete={onCardDelete}
                onStatusChange={onStatusChange}
                isDragging={draggingId === app.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
            {}
            {isDropTarget && (
              <div className="h-10 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-400">Drop here</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DropZone({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`flex-1 flex items-center justify-center rounded-xl border-2 border-dashed transition-colors py-10 ${
        isActive
          ? "border-gray-400 bg-gray-50"
          : "border-gray-200 bg-transparent"
      }`}
    >
      <p className="text-sm text-gray-400">Drop here</p>
    </div>
  );
}

function DraggableCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(application.id);
      }}
      onDragEnd={onDragEnd}
      className={`transition-all duration-150 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-30 scale-95" : ""
      }`}
    >
      <ApplicationCard
        application={application}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        compact
      />
    </div>
  );
}
