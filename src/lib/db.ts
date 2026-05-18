// lib/db.ts
import { JobApplication, Interview } from "@/types/job";

// In-memory storage with localStorage persistence on client side
// For API routes, we use this as a simulated DB
// For server components, we need to handle differently - we'll use fs or global
// Since this is Next.js, we use a global object to persist across API calls

declare global {
  // eslint-disable-next-line no-var
  var __jobTrackerDB: {
    applications: JobApplication[];
    interviews: Interview[];
  };
}

const initializeDB = () => {
  if (!global.__jobTrackerDB) {
    const now = new Date().toISOString();
    const sampleApps: JobApplication[] = [
      {
        id: "1",
        company: "Tech Corp",
        role: "Frontend Developer",
        location: "New York",
        workType: "remote",
        salary: "$80,000 - $100,000",
        status: "applied",
        appliedDate: new Date().toISOString().split("T")[0],
        url: "https://example.com/job/1",
        contactName: "John Doe",
        contactEmail: "john@techcorp.com",
        notes: "Excited about this role",
        tags: ["React", "Next.js"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "2",
        company: "Startup Inc",
        role: "Full Stack Engineer",
        location: "San Francisco",
        workType: "hybrid",
        salary: "$90,000 - $120,000",
        status: "interview",
        appliedDate: new Date(Date.now() - 7 * 86400000)
          .toISOString()
          .split("T")[0],
        url: "https://example.com/job/2",
        contactName: "Jane Smith",
        contactEmail: "jane@startupinc.com",
        notes: "Had a great first interview",
        tags: ["TypeScript", "Node.js"],
        createdAt: now,
        updatedAt: now,
      },
    ];
    const sampleInterviews: Interview[] = [
      {
        id: "int1",
        applicationId: "2",
        round: 1,
        type: "technical",
        scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
        duration: 60,
        interviewerName: "Alice Johnson",
        notes: "Prepare system design",
        outcome: "pending",
      },
    ];
    global.__jobTrackerDB = {
      applications: sampleApps,
      interviews: sampleInterviews,
    };
  }
};

export const getApplications = (): JobApplication[] => {
  initializeDB();
  return global.__jobTrackerDB.applications;
};

export const getApplicationById = (id: string): JobApplication | undefined => {
  initializeDB();
  return global.__jobTrackerDB.applications.find((app) => app.id === id);
};

export const createApplication = (
  data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">,
): JobApplication => {
  initializeDB();
  const now = new Date().toISOString();
  const newApp: JobApplication = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  global.__jobTrackerDB.applications.push(newApp);
  return newApp;
};

export const updateApplication = (
  id: string,
  data: Partial<JobApplication>,
): JobApplication | undefined => {
  initializeDB();
  const index = global.__jobTrackerDB.applications.findIndex(
    (app) => app.id === id,
  );
  if (index === -1) return undefined;
  const updated = {
    ...global.__jobTrackerDB.applications[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  global.__jobTrackerDB.applications[index] = updated;
  return updated;
};

export const deleteApplication = (id: string): boolean => {
  initializeDB();
  const initialLength = global.__jobTrackerDB.applications.length;
  global.__jobTrackerDB.applications =
    global.__jobTrackerDB.applications.filter((app) => app.id !== id);
  // Also delete associated interviews
  global.__jobTrackerDB.interviews = global.__jobTrackerDB.interviews.filter(
    (i) => i.applicationId !== id,
  );
  return global.__jobTrackerDB.applications.length !== initialLength;
};

export const getInterviews = (applicationId?: string): Interview[] => {
  initializeDB();
  if (applicationId) {
    return global.__jobTrackerDB.interviews.filter(
      (i) => i.applicationId === applicationId,
    );
  }
  return global.__jobTrackerDB.interviews;
};

export const getInterviewById = (id: string): Interview | undefined => {
  initializeDB();
  return global.__jobTrackerDB.interviews.find((i) => i.id === id);
};

export const createInterview = (data: Omit<Interview, "id">): Interview => {
  initializeDB();
  const newInterview: Interview = {
    ...data,
    id: crypto.randomUUID(),
  };
  global.__jobTrackerDB.interviews.push(newInterview);
  return newInterview;
};

export const updateInterview = (
  id: string,
  data: Partial<Interview>,
): Interview | undefined => {
  initializeDB();
  const index = global.__jobTrackerDB.interviews.findIndex((i) => i.id === id);
  if (index === -1) return undefined;
  const updated = { ...global.__jobTrackerDB.interviews[index], ...data };
  global.__jobTrackerDB.interviews[index] = updated;
  return updated;
};

export const deleteInterview = (id: string): boolean => {
  initializeDB();
  const initialLength = global.__jobTrackerDB.interviews.length;
  global.__jobTrackerDB.interviews = global.__jobTrackerDB.interviews.filter(
    (i) => i.id !== id,
  );
  return global.__jobTrackerDB.interviews.length !== initialLength;
};
