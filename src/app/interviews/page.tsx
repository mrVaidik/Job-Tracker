// app/interviews/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";

import {
  fetchInterviews,
  scheduleInterview,
  cancelInterview,
  editInterview,
} from "@/store/interview-slice";

import { fetchApplications } from "@/store/application-slice";

import { InterviewCard } from "@/components/InterviewCard";
import { InterviewCardSkeleton } from "@/components/InterViewcardSkeleton"; // fixed typo

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Interview } from "@/types/job";

// Define a type for interview type to avoid repeating union
type InterviewType = Interview["type"];

const EMPTY_FORM = {
  applicationId: "",
  round: 1,
  type: "phone" as InterviewType,
  scheduledAt: "",
  duration: 30,
  interviewerName: "",
  notes: "",
};

type FormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

export default function InterviewsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { interviews, loading } = useSelector(
    (state: RootState) => state.interviews,
  );

  const { applications } = useSelector(
    (state: RootState) => state.applications,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPast, setShowPast] = useState(false);

  // Minimum DateTime
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDateTime = today.toISOString().slice(0, 16);

  // Fetch Data
  useEffect(() => {
    dispatch(fetchInterviews());
    dispatch(fetchApplications());
  }, [dispatch]);

  // Upcoming Interviews
  const upcoming = useMemo(() => {
    return interviews
      .filter((i) => new Date(i.scheduledAt) > new Date())
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
  }, [interviews]);

  // Past Interviews
  const past = useMemo(() => {
    return interviews
      .filter((i) => new Date(i.scheduledAt) <= new Date())
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      );
  }, [interviews]);

  // Validation
  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!formData.applicationId) {
      e.applicationId = "Please select an application.";
    }
    if (!formData.round || formData.round < 1) {
      e.round = "Round must be at least 1.";
    }
    if (!formData.type) {
      e.type = "Please select interview type.";
    }
    if (!formData.scheduledAt) {
      e.scheduledAt = "Please select date & time.";
    } else if (new Date(formData.scheduledAt) <= new Date()) {
      e.scheduledAt = "Interview must be scheduled in future.";
    }
    if (!formData.duration || formData.duration < 5) {
      e.duration = "Duration must be at least 5 minutes.";
    }
    if (!formData.interviewerName.trim()) {
      e.interviewerName = "Interviewer name is required.";
    }

    return e;
  };

  // Schedule Interview
  const handleSchedule = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(scheduleInterview(formData)).unwrap();
      await dispatch(fetchInterviews());
      setFormData(EMPTY_FORM);
      setErrors({});
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to schedule interview:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear Error
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Modal Reset
  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  };

  // Edit Interview (toggle outcome)
  const handleEdit = async (interview: Interview) => {
    try {
      const newOutcome = interview.outcome === "pass" ? "fail" : "pass";
      await dispatch(
        editInterview({
          id: interview.id,
          data: { outcome: newOutcome },
        }),
      ).unwrap();
      await dispatch(fetchInterviews());
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Interview
  const handleDelete = async (id: string) => {
    try {
      await dispatch(cancelInterview(id)).unwrap();
      await dispatch(fetchInterviews());
    } catch (error) {
      console.error(error);
    }
  };

  // Error Message Component
  const ErrorMsg = ({ field }: { field: keyof FormErrors }) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Interviews</h1>

        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Application */}
              <div>
                <Label>
                  Application <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.applicationId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, applicationId: value });
                    clearError("applicationId");
                  }}
                >
                  <SelectTrigger
                    className={errors.applicationId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.company} - {app.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMsg field="applicationId" />
              </div>

              {/* Round */}
              <div>
                <Label>
                  Round <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.round}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      round: Number(e.target.value) || 1,
                    });
                    clearError("round");
                  }}
                  className={errors.round ? "border-red-500" : ""}
                />
                <ErrorMsg field="round" />
              </div>

              {/* Type */}
              <div>
                <Label>
                  Interview Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      type: value as InterviewType,
                    });
                    clearError("type");
                  }}
                >
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMsg field="type" />
              </div>

              {/* Date & Time */}
              <div>
                <Label>
                  Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  min={minDateTime}
                  value={formData.scheduledAt}
                  onChange={(e) => {
                    setFormData({ ...formData, scheduledAt: e.target.value });
                    clearError("scheduledAt");
                  }}
                  className={errors.scheduledAt ? "border-red-500" : ""}
                />
                <ErrorMsg field="scheduledAt" />
              </div>

              {/* Duration */}
              <div>
                <Label>
                  Duration (minutes) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={5}
                  value={formData.duration}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      duration: Number(e.target.value) || 5,
                    });
                    clearError("duration");
                  }}
                  className={errors.duration ? "border-red-500" : ""}
                />
                <ErrorMsg field="duration" />
              </div>

              {/* Interviewer Name */}
              <div>
                <Label>
                  Interviewer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.interviewerName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      interviewerName: e.target.value,
                    });
                    clearError("interviewerName");
                  }}
                  className={errors.interviewerName ? "border-red-500" : ""}
                />
                <ErrorMsg field="interviewerName" />
              </div>

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Optional notes..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full"
                onClick={handleSchedule}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Interview"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Interviews */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Upcoming Interviews</h2>
        <div className="space-y-3">
          {loading ? (
            <InterviewCardSkeleton count={3} />
          ) : upcoming.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                No upcoming interviews scheduled
              </p>
            </div>
          ) : (
            upcoming.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Past Interviews Toggle */}
      <div>
        <Button variant="ghost" onClick={() => setShowPast(!showPast)}>
          {showPast ? "Hide" : "Show"} Past Interviews
        </Button>
        {(showPast || loading) && (
          <div className="mt-3 space-y-3">
            {loading ? (
              <InterviewCardSkeleton count={2} />
            ) : past.length === 0 ? (
              <p className="text-muted-foreground">No past interviews</p>
            ) : (
              past.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
