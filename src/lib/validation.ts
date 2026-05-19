import { z } from "zod";

export const applicationSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  workType: z.enum(["remote", "hybrid", "on-site"] as const),
  salary: z.string().optional(),
  status: z.enum([
    "saved",
    "applied",
    "phone-screen",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ] as const),
  appliedDate: z.string().min(1, "Applied date is required"),
  url: z.string().optional(), 
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional(),
  notes: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
});

export const interviewSchema = z.object({
  applicationId: z.string().min(1, "Application is required"),
  round: z.number().min(1, "Round must be at least 1"),
  type: z.enum(["phone", "video", "on-site", "technical", "hr"] as const),
  scheduledAt: z.string().min(1, "Date and time is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  interviewerName: z.string().optional(),
  notes: z.string().optional().default(""),
  outcome: z.enum(["pass", "fail", "pending"]).optional().default("pending"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
export type InterviewFormValues = z.infer<typeof interviewSchema>;
