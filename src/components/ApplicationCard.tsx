"use client";


import { useRouter } from "next/navigation";
import { JobApplication, ApplicationStatus } from "@/types/job";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  saved:          { label: "Saved",        className: "bg-gray-100 text-gray-600 border border-gray-200" },
  applied:        { label: "Applied",      className: "bg-blue-50 text-blue-600 border border-blue-200" },
  "phone-screen": { label: "Phone Screen", className: "bg-purple-50 text-purple-600 border border-purple-200" },
  interview:      { label: "Interview",    className: "bg-amber-50 text-amber-600 border border-amber-200" },
  offer:          { label: "Offer",        className: "bg-green-50 text-green-600 border border-green-200" },
  rejected:       { label: "Rejected",     className: "bg-red-50 text-red-600 border border-red-200" },
  withdrawn:      { label: "Withdrawn",    className: "bg-orange-50 text-orange-600 border border-orange-200" },
};

const ALL_STATUSES: ApplicationStatus[] = [
  "saved", "applied", "phone-screen", "interview", "offer", "rejected", "withdrawn",
];

const WORK_TYPE_LABEL: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-Site",
};

const AVATAR_COLORS = [
  "bg-slate-700", "bg-indigo-600", "bg-violet-600",
  "bg-teal-600",  "bg-rose-600",   "bg-amber-600", "bg-cyan-700",
];

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  compact?: boolean;
  className?: string;
}

function getAvatarColor(company: string) {
  const sum = company.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function getInitials(company: string) {
  return company.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function IconPin() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
function IconOffice() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
    </svg>
  );
}

// ─── Status Select ────────────────────────────────────────────────────────────

function StatusSelect({
  value,
  onChange,
  size = "md",
}: {
  value: ApplicationStatus;
  onChange: (s: ApplicationStatus) => void;
  size?: "sm" | "md";
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      onClick={(e) => e.stopPropagation()}
      className={`border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer ${
        size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5 min-w-[120px]"
      }`}
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_CONFIG[s].label}
        </option>
      ))}
    </select>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
  compact = false,
  className = "",
}: ApplicationCardProps) {
  const router = useRouter();
  const statusCfg = STATUS_CONFIG[application.status];
  const avatarBg  = getAvatarColor(application.company);
  const initials  = getInitials(application.company);

  const formattedDate = application.appliedDate
    ? new Date(application.appliedDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const visibleTags = application.tags.slice(0, compact ? 3 : 5);
  const extraTags   = application.tags.length - visibleTags.length;

  // ── Compact (Kanban) ──────────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:shadow transition-shadow ${className}`}
      >
        {/* Top row */}
        <div className="flex items-start gap-2.5">
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${avatarBg} flex items-center justify-center text-white text-xs font-bold select-none`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{application.company}</p>
                <p className="text-xs text-gray-500 truncate">{application.role}</p>
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusCfg.className}`}>
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-400">
          {application.location && (
            <span className="flex items-center gap-1"><IconPin />{application.location}</span>
          )}
          <span className="flex items-center gap-1"><IconOffice />{WORK_TYPE_LABEL[application.workType]}</span>
          {formattedDate && (
            <span className="flex items-center gap-1"><IconCalendar />{formattedDate}</span>
          )}
        </div>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{tag}</span>
            ))}
            {extraTags > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded text-xs">+{extraTags}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(application); }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              <IconEdit /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(application.id); }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <IconTrash /> Delete
            </button>
          </div>
          <StatusSelect
            value={application.status}
            onChange={(s) => onStatusChange(application.id, s)}
            size="sm"
          />
        </div>
      </div>
    );
  }

  // ── Full (List) ───────────────────────────────────────────────────────────
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-shadow ${className}`}>
      {/* Offer accent bar */}
      {application.status === "offer" && (
        <div className="h-1 bg-green-500 rounded-t-xl" />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${avatarBg} flex items-center justify-center text-white text-sm font-bold select-none`}>
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{application.company}</p>
            <p className="text-sm text-gray-500">{application.role}</p>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
              {application.location && (
                <span className="flex items-center gap-1"><IconPin />{application.location}</span>
              )}
              <span className="flex items-center gap-1"><IconOffice />{WORK_TYPE_LABEL[application.workType]}</span>
            </div>

            {application.salary && (
              <p className="mt-1 text-sm font-medium text-gray-800">{application.salary}</p>
            )}

            {formattedDate && (
              <p className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                <IconCalendar />Applied: {formattedDate}
              </p>
            )}

            {visibleTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {visibleTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{tag}</span>
                ))}
                {extraTags > 0 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md text-xs font-medium">+{extraTags} more</span>
                )}
              </div>
            )}
          </div>

          {/* Right: badge + dropdown + icon buttons */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2.5">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <StatusSelect
              value={application.status}
              onChange={(s) => onStatusChange(application.id, s)}
            />
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onEdit(application)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
                <IconEdit />
              </button>
              <button
                onClick={() => onDelete(application.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <IconTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}