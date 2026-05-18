// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    saved: "bg-gray-500",
    applied: "bg-blue-500",
    "phone-screen": "bg-purple-500",
    interview: "bg-yellow-500",
    offer: "bg-green-500",
    rejected: "bg-red-500",
    withdrawn: "bg-gray-400",
  };
  return colors[status] || "bg-gray-500";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// ✅ Missing function – checks if a date falls within the current ISO week
export const isInCurrentWeek = (dateString: string): boolean => {
  const { start, end } = getWeekRange();
  const date = new Date(dateString);
  return date >= start && date <= end;
};
