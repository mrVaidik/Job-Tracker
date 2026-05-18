// components/application-filters-bar.tsx
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setFilters, clearFilters } from "@/store/application-slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ApplicationStatus, WorkType } from "@/types/job";

export function ApplicationFiltersBar() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.applications.filters);
  
  return (
    <div className="flex flex-wrap gap-3 items-end p-4 border rounded-lg bg-muted/20">
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-medium mb-1 block">Search</label>
        <Input
          placeholder="Company, role, location..."
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
        />
      </div>
      
      <div className="w-[150px]">
        <label className="text-sm font-medium mb-1 block">Status</label>
        <Select
          value={filters.status}
          onValueChange={(value) => dispatch(setFilters({ status: value as ApplicationStatus | "all" }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="saved">Saved</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="phone-screen">Phone Screen</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-[130px]">
        <label className="text-sm font-medium mb-1 block">Work Type</label>
        <Select
          value={filters.workType}
          onValueChange={(value) => dispatch(setFilters({ workType: value as WorkType | "all" }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="on-site">On-site</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(filters.search || filters.status !== "all" || filters.workType !== "all" || filters.tags.length > 0) && (
        <Button variant="ghost" onClick={() => dispatch(clearFilters())} className="mt-auto">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}