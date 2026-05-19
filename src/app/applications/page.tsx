import { Suspense } from "react";
import { JobApplication } from "@/types/job";
import ApplicationsClient from "@/components/ApplicationClient";
import ApplicationsSkeleton from "@/components/ApplicationSkeleton";

async function getApplications(): Promise<JobApplication[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/applications`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
  } catch {
    return [];
  }
}

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <Suspense fallback={<ApplicationsSkeleton />}>
      <ApplicationsClient initialApplications={applications} />
    </Suspense>
  );
}
