import { ApplicationsClient } from "@/components/ApplicationClient";
import { getApplications } from "@/lib/db";

export default async function ApplicationsPage() {
  const initialApplications = getApplications();
  
  return <ApplicationsClient initialApplications={initialApplications} />;
}