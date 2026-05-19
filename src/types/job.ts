export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone-screen"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
export type WorkType = "remote" | "hybrid" | "on-site";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  workType: WorkType;
  salary?: string;
  status: ApplicationStatus;
  appliedDate: string;
  url?: string;
  contactName?: string;
  contactEmail?: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  round: number;
  type: "phone" | "video" | "on-site" | "technical" | "hr";
  scheduledAt: string;
  duration: number;
  interviewerName?: string;
  notes: string;
  outcome?: "pass" | "fail" | "pending";
}

export interface ApplicationFilters {
  status: ApplicationStatus | "all";
  workType: WorkType | "all";
  search: string;
  tags: string[];
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  responseRate: number;
  offerRate: number;
  activeApplications: number;
}
