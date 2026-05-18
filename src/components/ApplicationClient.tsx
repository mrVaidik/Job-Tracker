// app/applications/applications-client.tsx

"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { AppDispatch, RootState } from "@/store";

import {
  fetchApplications,
  setViewMode,
  deleteApplication,
  editApplication,
} from "@/store/application-slice";

import { ApplicationCard } from "./ApplicationCard";

import { KanbanColumn } from "./KanbanColumn";

import { ApplicationFiltersBar } from "./ApplicationFilterBar";

import { useFilteredApplications } from "@/hooks/useFilteredApplications";

import { Button } from "@/components/ui/button";

import { LayoutGrid, List, Plus } from "lucide-react";

import { JobApplication, ApplicationStatus } from "@/types/job";

// ─────────────────────────────────────────────

interface ApplicationsClientProps {
  initialApplications: JobApplication[];
}

// ─────────────────────────────────────────────

const statuses: ApplicationStatus[] = [
  "saved",
  "applied",
  "phone-screen",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

// ─────────────────────────────────────────────

export function ApplicationsClient({
  initialApplications,
}: ApplicationsClientProps) {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const viewMode = useSelector(
    (state: RootState) => state.applications.viewMode,
  );

  const { filteredApplications } = useFilteredApplications();

  // ─────────────────────────────────────────────
  // DND
  // ─────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // ─────────────────────────────────────────────
  // LOAD APPLICATIONS
  // ─────────────────────────────────────────────

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    await dispatch(deleteApplication(id));
  };

  // ─────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await dispatch(
      editApplication({
        id,
        data: { status },
      }),
    );
  };

  // ─────────────────────────────────────────────
  // EDIT
  // ─────────────────────────────────────────────

  const handleEdit = (application: JobApplication) => {
    router.push(`/edit/${application.id}`);
  };

  // ─────────────────────────────────────────────
  // DRAG END
  // ─────────────────────────────────────────────

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const applicationId = active.id as string;

    const newStatus = over.id as ApplicationStatus;

    const application = filteredApplications.find(
      (app) => app.id === applicationId,
    );

    if (!application) return;

    if (application.status === newStatus) {
      return;
    }

    await dispatch(
      editApplication({
        id: applicationId,
        data: {
          status: newStatus,
        },
      }),
    );
  };

  // ─────────────────────────────────────────────
  // GROUP APPLICATIONS
  // ─────────────────────────────────────────────

  const applicationsByStatus = statuses.reduce(
    (acc, status) => {
      acc[status] = filteredApplications.filter((app) => app.status === status);

      return acc;
    },
    {} as Record<ApplicationStatus, JobApplication[]>,
  );

  // ─────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Applications</h1>

          <p className="text-muted-foreground mt-1">
            Manage your job applications visually.
          </p>
        </div>

        {/* ACTIONS */}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/add")}
            className="rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>

          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => dispatch(setViewMode("list"))}
            className="rounded-xl"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="icon"
            onClick={() => dispatch(setViewMode("kanban"))}
            className="rounded-xl"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* FILTERS */}

      <ApplicationFiltersBar />

      {/* LIST VIEW */}

      {viewMode === "list" ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onStatusChange={handleStatusChange}
            />
          ))}

          {filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed">
              <div className="text-5xl mb-4">📂</div>

              <h3 className="text-lg font-semibold">No Applications Found</h3>

              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="
              flex
              gap-6
              overflow-x-auto
              pb-4
              snap-x
              snap-mandatory
            "
          >
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={applicationsByStatus[status]}
                onCardEdit={handleEdit}
                onCardDelete={handleDelete}
                onStatusChange={handleStatusChange}
                className="snap-start"
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
