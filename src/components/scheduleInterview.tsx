"use client";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";

import { scheduleInterview } from "@/store/interview-slice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JobApplication } from "@/types/job";

import { interviewSchema, InterviewFormValues } from "@/lib/validation";

import { z } from "zod";

interface ScheduleInterviewDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  preselectedApplicationId?: string;
}

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  preselectedApplicationId,
}: ScheduleInterviewDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const applications = useSelector(
    (state: RootState) => state.applications.applications,
  );

  const [formData, setFormData] = useState<Partial<InterviewFormValues>>({
    applicationId: preselectedApplicationId || "",

    round: 1,

    type: "phone",

    scheduledAt: "",

    duration: 30,

    interviewerName: "",

    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedApplicationId) {
      setFormData((prev) => ({
        ...prev,
        applicationId: preselectedApplicationId,
      }));
    }
  }, [preselectedApplicationId]);

  const handleChange = (
    field: keyof InterviewFormValues,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = (): boolean => {
    try {
      interviewSchema.parse(formData);

      setErrors({});

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};

        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });

        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await dispatch(
      scheduleInterview(formData as Omit<InterviewFormValues, "id">),
    );

    onOpenChange(false);

    setFormData({
      applicationId: "",

      round: 1,

      type: "phone",

      scheduledAt: "",

      duration: 30,

      interviewerName: "",

      notes: "",
    });
  };

  const selectedApp = applications.find(
    (app) => app.id === formData.applicationId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {}

          <div className="space-y-2">
            <Label>Application *</Label>

            <Select
              value={formData.applicationId || ""}
              onValueChange={(value) => handleChange("applicationId", value)}
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

            {errors.applicationId && (
              <p className="text-sm text-red-500">{errors.applicationId}</p>
            )}
          </div>

          {}

          {selectedApp && (
            <div className="text-sm text-muted-foreground">
              Current status:{" "}
              <span className="capitalize font-medium">
                {selectedApp.status}
              </span>
            </div>
          )}

          {}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Round *</Label>

              <Input
                type="number"
                min={1}
                value={formData.round || 1}
                onChange={(e) =>
                  handleChange("round", Number(e.target.value) || 1)
                }
                className={errors.round ? "border-red-500" : ""}
              />

              {errors.round && (
                <p className="text-sm text-red-500">{errors.round}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Type *</Label>

              <Select
                value={formData.type || "phone"}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
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
            </div>
          </div>

          {}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date & Time *</Label>

              <Input
                type="datetime-local"
                value={formData.scheduledAt || ""}
                onChange={(e) => handleChange("scheduledAt", e.target.value)}
                className={errors.scheduledAt ? "border-red-500" : ""}
              />

              {errors.scheduledAt && (
                <p className="text-sm text-red-500">{errors.scheduledAt}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Duration *</Label>

              <Input
                type="number"
                min={1}
                value={formData.duration || 30}
                onChange={(e) =>
                  handleChange("duration", Number(e.target.value) || 30)
                }
                className={errors.duration ? "border-red-500" : ""}
              />

              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration}</p>
              )}
            </div>
          </div>

          {}

          <div className="space-y-2">
            <Label>Interviewer Name</Label>

            <Input
              value={formData.interviewerName || ""}
              onChange={(e) => handleChange("interviewerName", e.target.value)}
            />
          </div>

          {}

          <div className="space-y-2">
            <Label>Notes</Label>

            <textarea
              className="w-full min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>Schedule</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
