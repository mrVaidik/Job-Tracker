"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ApplicationsSkeleton() {
  let viewMode: "list" | "kanban" = "kanban";

  try {
    viewMode = useSelector((state: RootState) => state.applications.viewMode);
  } catch {
    viewMode = "kanban";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header – same as before */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Shimmer className="h-8 w-44 rounded-lg" />
            <Shimmer className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="h-10 w-40 rounded-xl" />
            <div className="flex overflow-hidden rounded-xl border border-gray-200">
              <Shimmer className="h-10 w-10" />
              <Shimmer className="h-10 w-10 border-l border-gray-200" />
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="max-w-screen-2xl mx-auto mt-5">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-4">
            <div className="flex-1">
              <Shimmer className="h-4 w-16 rounded mb-2" />
              <Shimmer className="h-5 w-full rounded-lg" />
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div>
                <Shimmer className="h-4 w-14 rounded mb-2" />
                <Shimmer className="h-5 w-20 rounded-lg" />
              </div>
              <div>
                <Shimmer className="h-4 w-20 rounded mb-2" />
                <Shimmer className="h-5 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "kanban" ? <KanbanSkeleton /> : <ListSkeleton />}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* KANBAN SKELETON – matches actual column & card design */
/* ───────────────────────────────────────────────────────────── */

function KanbanSkeleton() {
  // Define columns with realistic card counts (some empty to show drop zone)
  const columns = [
    { status: "Saved", count: 2, hasCards: true },
    { status: "Applied", count: 3, hasCards: true },
    { status: "Phone Screen", count: 0, hasCards: false },
    { status: "Interview", count: 2, hasCards: true },
    { status: "Offer", count: 0, hasCards: false },
    { status: "Rejected", count: 1, hasCards: true },
    { status: "Withdrawn", count: 1, hasCards: true },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 px-6 py-6 min-w-max">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="w-[320px] flex-shrink-0 rounded-lg bg-gray-50 border border-gray-200 flex flex-col"
          >
            {/* Column Header */}
            <div className="px-3 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Shimmer className="h-5 w-24 rounded" />
                <Shimmer className="h-5 w-8 rounded-full" />
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2 space-y-2">
              {col.hasCards ? (
                Array.from({ length: col.count }).map((_, i) => (
                  <KanbanCardSkeleton key={i} />
                ))
              ) : (
                // "Drop here" placeholder for empty columns
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Shimmer className="h-4 w-20 mx-auto rounded" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 shadow-sm">
      {/* Top row: left side (company + role) and right side (status badge + actions) */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Shimmer className="h-4 w-24 rounded" />
            <Shimmer className="h-4 w-16 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Status badge */}
          <Shimmer className="h-6 w-20 rounded-full" />
          {/* Edit icon */}
          <Shimmer className="h-7 w-7 rounded" />
          {/* Delete icon */}
          <Shimmer className="h-7 w-7 rounded" />
        </div>
      </div>

      {/* Location & Work Type */}
      <div className="flex items-center gap-2 text-xs">
        <Shimmer className="h-3 w-20 rounded" />
        <span className="text-gray-300">•</span>
        <Shimmer className="h-3 w-14 rounded" />
      </div>

      {/* Applied Date */}
      <div className="flex items-center gap-1">
        <Shimmer className="h-3 w-3 rounded-full" />
        <Shimmer className="h-3 w-28 rounded" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 pt-1">
        <Shimmer className="h-5 w-14 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-5 w-10 rounded-full" />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* LIST SKELETON (unchanged, still works) */
/* ───────────────────────────────────────────────────────────── */

function ListSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-5 flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ListCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ListCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex gap-4">
        <Shimmer className="w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Shimmer className="h-5 w-44 rounded-md mb-2" />
              <Shimmer className="h-4 w-32 rounded-md mb-4" />
              <div className="flex gap-2 mb-4">
                <Shimmer className="h-4 w-16 rounded-md" />
                <Shimmer className="h-4 w-20 rounded-md" />
                <Shimmer className="h-4 w-14 rounded-md" />
              </div>
            </div>
            <Shimmer className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex gap-2 mb-4">
            <Shimmer className="h-5 w-16 rounded-md" />
            <Shimmer className="h-5 w-20 rounded-md" />
          </div>
          <div className="h-px bg-gray-100 my-4" />
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Shimmer className="h-4 w-12 rounded-md" />
              <Shimmer className="h-4 w-14 rounded-md" />
            </div>
            <Shimmer className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* SHIMMER */
/* ───────────────────────────────────────────────────────────── */

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-md ${className}`}
    />
  );
}
