// app/api/interviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getInterviews, createInterview, getApplicationById } from "@/lib/db";
import { interviewSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const applicationId = searchParams.get("applicationId") || undefined;
  const interviews = getInterviews(applicationId);
  return NextResponse.json(interviews);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = interviewSchema.parse(body);

    const application = getApplicationById(validated.applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const scheduledDate = new Date(validated.scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled date must be in the future" },
        { status: 400 },
      );
    }

    const newInterview = createInterview({
      applicationId: validated.applicationId,
      round: validated.round,
      type: validated.type,
      scheduledAt: validated.scheduledAt,
      duration: validated.duration,
      interviewerName: validated.interviewerName,
      notes: validated.notes || "",
      outcome: validated.outcome || "pending",
    });

    return NextResponse.json(newInterview, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
