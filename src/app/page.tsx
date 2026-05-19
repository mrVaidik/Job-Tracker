"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchApplications } from "@/store/application-slice";
import { useApplicationStats } from "@/hooks/useApplicationStats";
import { useJobSearch } from "@/context/jobSearchContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Briefcase, CheckCircle, Percent, Users } from "lucide-react";

import { StatusPipeline } from "@/components/StatusPipeline";

// Helper to extract numeric salary from string
function extractSalaryNumber(salaryStr: string | undefined): number | null {
  if (!salaryStr) return null;

  const cleaned = salaryStr.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);

  return isNaN(num) ? null : num;
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const applications = useSelector(
    (state: RootState) => state.applications.applications,
  );

  const loadingStatus = useSelector(
    (state: RootState) => state.applications.status,
  );

  const stats = useApplicationStats();

  const { targetRole, setTargetRole, targetSalary, setTargetSalary } =
    useJobSearch();

  // Fetch applications on mount
  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    let matches = true;

    // Role filter
    if (targetRole.trim()) {
      matches =
        matches && app.role.toLowerCase().includes(targetRole.toLowerCase());
    }

    // Salary filter
    if (targetSalary.trim()) {
      const targetNum = parseInt(targetSalary.replace(/[^0-9]/g, ""), 10);

      const appSalaryNum = extractSalaryNumber(app.salary);

      if (!isNaN(targetNum) && appSalaryNum !== null) {
        matches = matches && appSalaryNum >= targetNum;
      } else {
        matches = false;
      }
    }

    return matches;
  });
  if (applications.length === 0 && loadingStatus !== "succeeded") {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6 space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Applications */}
        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />

          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
                  </div>

                  <div className="h-4 w-52 animate-pulse rounded bg-muted" />

                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />

                  <div className="flex gap-2">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>

            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>

            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{stats.activeApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>

            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {stats.responseRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>

            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {stats.offerRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="targetRole">Filter by Target Role</Label>

          <Input
            id="targetRole"
            placeholder="e.g., Frontend Developer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetSalary">Minimum Salary (numeric)</Label>

          <Input
            id="targetSalary"
            placeholder="e.g., 100000"
            value={targetSalary}
            onChange={(e) => setTargetSalary(e.target.value)}
          />
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">
          Applications{" "}
          {filteredApplications.length > 0 &&
            `(${filteredApplications.length})`}
        </h2>

        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No applications match your filters.
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{app.company}</h3>

                      <Badge variant="outline">{app.role}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {app.location} • {app.workType}
                    </div>

                    {app.salary && (
                      <div className="text-sm font-medium">💰 {app.salary}</div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-1">
                      {app.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}

                      {app.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{app.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="md:w-1/2">
                    <StatusPipeline currentStatus={app.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
