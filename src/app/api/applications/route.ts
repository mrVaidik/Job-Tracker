// app/api/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getApplications, createApplication } from "@/lib/db";
import { applicationSchema } from "@/lib/validation";
import { JobApplication, ApplicationStatus, WorkType } from "@/types/job";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let applications = getApplications();

  const status = searchParams.get("status");
  if (status && status !== "all") {
    applications = applications.filter(
      (app) => app.status === (status as ApplicationStatus),
    );
  }

  const workType = searchParams.get("workType");
  if (workType && workType !== "all") {
    applications = applications.filter(
      (app) => app.workType === (workType as WorkType),
    );
  }

  const search = searchParams.get("search");
  if (search) {
    const searchLower = search.toLowerCase();
    applications = applications.filter(
      (app) =>
        app.company.toLowerCase().includes(searchLower) ||
        app.role.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower),
    );
  }

  const tagsParam = searchParams.get("tags");
  if (tagsParam) {
    const tags = tagsParam.split(",");
    applications = applications.filter((app) =>
      tags.some((tag) => app.tags.includes(tag)),
    );
  }

  applications.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = applicationSchema.parse(body);

    const newApplication = createApplication({
      company: validated.company,
      role: validated.role,
      location: validated.location,
      workType: validated.workType,
      salary: validated.salary,
      status: validated.status,
      appliedDate: validated.appliedDate,
      url: validated.url,
      contactName: validated.contactName,
      contactEmail: validated.contactEmail,
      notes: validated.notes || "",
      tags: validated.tags || [],
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
