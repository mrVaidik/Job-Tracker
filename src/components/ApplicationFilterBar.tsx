"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setFilters, clearFilters } from "@/store/application-slice";
import { ApplicationStatus, WorkType } from "@/types/job";

const STATUS_OPTIONS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "phone-screen", label: "Phone Screen" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

const WORK_TYPE_OPTIONS: { value: WorkType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-Site" },
];

export default function ApplicationFiltersBar() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.applications.filters);

  const hasActive =
    filters.status !== "all" ||
    filters.workType !== "all" ||
    filters.search !== "" ||
    filters.tags.length > 0;

  return (
    <div className="border border-gray-200 rounded-xl bg-white px-4 py-3 flex items-center gap-4">
      {}
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Search</label>
        <input
          type="text"
          placeholder="Company, role, location..."
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          className="text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
        />
      </div>

      <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

      {}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <label className="text-xs font-medium text-gray-500">Status</label>
        <div className="flex items-center gap-1">
          <select
            value={filters.status}
            onChange={(e) =>
              dispatch(
                setFilters({
                  status: e.target.value as ApplicationStatus | "all",
                }),
              )
            }
            className="text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="w-3 h-3 text-gray-400 pointer-events-none -ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

      {}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <label className="text-xs font-medium text-gray-500">Work Type</label>
        <div className="flex items-center gap-1">
          <select
            value={filters.workType}
            onChange={(e) =>
              dispatch(
                setFilters({ workType: e.target.value as WorkType | "all" }),
              )
            }
            className="text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            {WORK_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="w-3 h-3 text-gray-400 pointer-events-none -ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {}
      {hasActive && (
        <>
          <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
          <button
            onClick={() => dispatch(clearFilters())}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}
