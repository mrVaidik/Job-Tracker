"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/store";

import {
  fetchApplications,
  setViewMode,
  editApplication,
  deleteApplication,
} from "@/store/application-slice";

import { JobApplication, ApplicationStatus } from "@/types/job";

import { useFilteredApplications } from "@/hooks/useFilteredApplications";

import ApplicationCard from "@/components/ApplicationCard";
import KanbanBoard from "@/components/KanbanBoard";
import ApplicationFiltersBar from "@/components/ApplicationFilterBar";
import ApplicationsSkeleton from "@/components/ApplicationSkeleton";

interface ApplicationsClientProps {
  initialApplications: JobApplication[];
}

export default function ApplicationsClient({
  initialApplications,
}: ApplicationsClientProps) {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const {
    viewMode,
    initialized,
    applications: storeApplications,
  } = useSelector((state: RootState) => state.applications);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchApplications());
    }
  }, [dispatch, initialized]);

  const { filteredApplications } = useFilteredApplications();

  const applications =
    initialized && storeApplications.length > 0
      ? filteredApplications
      : initialApplications;

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await dispatch(
      editApplication({
        id,
        data: { status },
      }),
    );
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Delete this application? This action cannot be undone.",
    );

    if (!confirmed) return;

    await dispatch(deleteApplication(id));
  };

  const handleEdit = (application: JobApplication) => {
    router.push(`/edit/${application.id}`);
  };

  // ✅ Proper loading skeleton
  if (!initialized) {
    return <ApplicationsSkeleton viewMode={viewMode} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
          {/* Left */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your job applications visually.
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Add Button */}
            <button
              onClick={() => router.push("/add")}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition-colors
                hover:bg-gray-100
              "
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Application
            </button>

            {/* View Toggle */}
            <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* List */}
              <button
                onClick={() => dispatch(setViewMode("list"))}
                className={`
                  flex
                  items-center
                  justify-center
                  px-3
                  py-2.5
                  transition-colors
                  ${
                    viewMode === "list"
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
                title="List View"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>

              {/* Kanban */}
              <button
                onClick={() => dispatch(setViewMode("kanban"))}
                className={`
                  flex
                  items-center
                  justify-center
                  px-3
                  py-2.5
                  transition-colors
                  ${
                    viewMode === "kanban"
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
                title="Kanban View"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mx-auto mt-5 max-w-screen-2xl">
          <ApplicationFiltersBar />
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <ListView
          applications={applications}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="px-6 py-6">
          <KanbanBoard
            applications={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
}

interface ListViewProps {
  applications: JobApplication[];

  onEdit: (app: JobApplication) => void;

  onDelete: (id: string) => void;

  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

function ListView({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: ListViewProps) {
  if (applications.length === 0) {
    return (
      <div
        className="
          flex
          h-[60vh]
          flex-col
          items-center
          justify-center
          px-6
          text-center
        "
      >
        <div className="mb-4 text-5xl">📂</div>

        <h3 className="text-lg font-semibold text-gray-900">
          No applications found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters or add a new application.
        </p>

        <a
          href="/add"
          className="
            mt-5
            rounded-xl
            bg-gray-900
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-gray-800
          "
        >
          Add Application
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-6 py-6">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
