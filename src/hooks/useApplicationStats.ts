// hooks/use-application-stats.ts
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ApplicationStats, ApplicationStatus } from "@/types/job";

export function useApplicationStats(): ApplicationStats {
  const applications = useSelector(
    (state: RootState) => state.applications.applications,
  );

  const total = applications.length;

  const byStatus = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>,
  );

  // Initialize all statuses with 0
  const allStatuses: ApplicationStatus[] = [
    "saved",
    "applied",
    "phone-screen",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ];
  allStatuses.forEach((status) => {
    if (!byStatus[status]) byStatus[status] = 0;
  });

  const nonSaved = applications.filter((app) => app.status !== "saved").length;
  const responded = applications.filter(
    (app) => app.status !== "saved" && app.status !== "applied",
  ).length;
  const responseRate = nonSaved > 0 ? (responded / nonSaved) * 100 : 0;

  const offerRate = total > 0 ? (byStatus["offer"] / total) * 100 : 0;

  const activeApplications = applications.filter(
    (app) => app.status !== "rejected" && app.status !== "withdrawn",
  ).length;

  return {
    total,
    byStatus,
    responseRate,
    offerRate,
    activeApplications,
  };
}
