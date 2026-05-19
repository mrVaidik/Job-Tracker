import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { JobApplication } from "@/types/job";

export function useFilteredApplications() {
  const applications = useSelector(
    (state: RootState) => state.applications.applications,
  );
  const filters = useSelector((state: RootState) => state.applications.filters);

  const filteredApplications = applications.filter((app) => {
    if (filters.status !== "all" && app.status !== filters.status) return false;

    if (filters.workType !== "all" && app.workType !== filters.workType)
      return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        app.company.toLowerCase().includes(searchLower) ||
        app.role.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => app.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  return {
    filteredApplications,
    count: filteredApplications.length,
  };
}
