// app/interviews/page.tsx
"use client";

import { useEffect, useState } from "react";
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

const EMPTY_FORM = {
  applicationId: "",
  round: 1,
  type: "phone" as const,
  scheduledAt: "",
  duration: 30,
  interviewerName: "",
  notes: "",
};

type FormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

export default function InterviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const interviews = useSelector(
    (state: RootState) => state.interviews.interviews,
  );
  const applications = useSelector(
    (state: RootState) => state.applications.applications,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDateTime = today.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"

  useEffect(() => {
    dispatch(fetchInterviews());
    dispatch(fetchApplications());
  }, [dispatch]);

  const upcoming = interviews
    .filter((i) => new Date(i.scheduledAt) > new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );

  const past = interviews
    .filter((i) => new Date(i.scheduledAt) <= new Date())
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!formData.applicationId)
      e.applicationId = "Please select an application.";

    if (!formData.round || formData.round < 1)
      e.round = "Round must be at least 1.";

    if (!formData.type) e.type = "Please select an interview type.";

    if (!formData.scheduledAt) e.scheduledAt = "Please pick a date and time.";
    else if (new Date(formData.scheduledAt) <= new Date())
      e.scheduledAt = "Scheduled time must be in the future.";

    if (!formData.duration || formData.duration < 5)
      e.duration = "Duration must be at least 5 minutes.";

    if (!formData.interviewerName.trim())
      e.interviewerName = "Interviewer name is required.";

    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSchedule = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(scheduleInterview(formData)).unwrap();
      await dispatch(fetchInterviews()); // refresh list
      setIsModalOpen(false);
      setFormData(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      console.error("Failed to schedule interview:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear a field's error as soon as the user fixes it
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Close / reset modal ───────────────────────────────────────────────────
  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  };

  // ── Edit / Delete ─────────────────────────────────────────────────────────
  const handleEdit = async (interview: Interview) => {
    const newOutcome = interview.outcome === "pass" ? "fail" : "pass";
    await dispatch(
      editInterview({ id: interview.id, data: { outcome: newOutcome } }),
    );
    await dispatch(fetchInterviews());
  };

  const handleDelete = async (id: string) => {
    await dispatch(cancelInterview(id));
    await dispatch(fetchInterviews());
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const ErrorMsg = ({ field }: { field: keyof FormErrors }) =>
    errors[field] ? (
      <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Interviews</h1>

        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent>
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
                  onValueChange={(v) => {
                    setFormData({ ...formData, applicationId: v });
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
                      round: parseInt(e.target.value) || 1,
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
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => {
                    setFormData({ ...formData, type: v as any });
                    clearError("type");
                  }}
                >
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMsg field="type" />
              </div>

              {/* Date & Time */}
              <div>
                <Label>
                  Date &amp; Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  min={minDateTime}
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
                      duration: parseInt(e.target.value) || 5,
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

              {/* Notes (optional) */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Optional notes..."
                />
              </div>

              <Button
                onClick={handleSchedule}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Scheduling…" : "Schedule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Upcoming Interviews</h2>
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">No upcoming interviews</p>
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

      {/* Past */}
      <div>
        <Button variant="ghost" onClick={() => setShowPast(!showPast)}>
          {showPast ? "Hide" : "Show"} Past Interviews
        </Button>
        {showPast && (
          <div className="space-y-3 mt-3">
            {past.length === 0 ? (
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