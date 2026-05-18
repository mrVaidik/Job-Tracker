// app/edit/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";

import { editApplication, fetchApplications } from "@/store/application-slice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, ArrowLeft, Save, BriefcaseBusiness } from "lucide-react";

import { WorkType, ApplicationStatus } from "@/types/job";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type FormValues = {
  company: string;
  role: string;
  location: string;
  workType: WorkType;
  salary: string;
  status: ApplicationStatus;
  appliedDate: string;
  url: string;
  contactName: string;
  contactEmail: string;
  notes: string;
  tags: string;
};

// ─────────────────────────────────────────────
// STATUS NORMALIZER
// ─────────────────────────────────────────────

function normalizeStatus(status?: string): ApplicationStatus {
  switch (status) {
    case "phone_screen":
      return "phone-screen";

    case "phone-screen":
      return "phone-screen";

    case "saved":
      return "saved";

    case "applied":
      return "applied";

    case "interview":
      return "interview";

    case "offer":
      return "offer";

    case "rejected":
      return "rejected";

    case "withdrawn":
      return "withdrawn";

    default:
      return "saved";
  }
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function EditApplicationPage() {
  const router = useRouter();

  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const applications = useSelector(
    (state: RootState) => state.applications.applications,
  );

  const [loading, setLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─────────────────────────────────────────────

  const application = useMemo(() => {
    return applications.find((app) => app.id === id);
  }, [applications, id]);

  // ─────────────────────────────────────────────

  const [values, setValues] = useState<FormValues>({
    company: "",
    role: "",
    location: "",
    workType: "on-site",
    salary: "",
    status: "saved",
    appliedDate: "",
    url: "",
    contactName: "",
    contactEmail: "",
    notes: "",
    tags: "",
  });

  // ─────────────────────────────────────────────
  // FETCH APPLICATIONS
  // ─────────────────────────────────────────────

  useEffect(() => {
    async function loadData() {
      try {
        if (applications.length === 0) {
          await dispatch(fetchApplications());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dispatch]);

  // ─────────────────────────────────────────────
  // SET OLD VALUES
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (application) {
      setValues({
        company: application.company || "",

        role: application.role || "",

        location: application.location || "",

        workType: (application.workType as WorkType) || "on-site",

        salary: application.salary || "",

        status: normalizeStatus(application.status),

        appliedDate: application.appliedDate || "",

        url: application.url || "",

        contactName: application.contactName || "",

        contactEmail: application.contactEmail || "",

        notes: application.notes || "",

        tags: Array.isArray(application.tags)
          ? application.tags.join(", ")
          : typeof application.tags === "string"
            ? application.tags
            : "",
      });
    }
  }, [application]);

  // ─────────────────────────────────────────────

  const set = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ─────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!application) return;

    setIsSubmitting(true);

    try {
      await dispatch(
        editApplication({
          id: application.id,

          data: {
            ...values,

            tags: values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          },
        }),
      ).unwrap();

      await dispatch(fetchApplications()).unwrap();

      router.push("/applications");
    } catch (error) {
      console.error("Error updating application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-3xl font-bold">Application Not Found</h2>

        <Button onClick={() => router.push("/applications")}>Back</Button>
      </div>
    );
  }

  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur">
          {/* HEADER */}

          <CardHeader className="border-b pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Job Tracker
                </div>

                <CardTitle className="text-3xl font-bold tracking-tight">
                  Edit Application
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Update your job application details professionally.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/applications")}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </CardHeader>

          {/* FORM */}

          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* COMPANY & ROLE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Company</Label>

                  <Input
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>

                  <Input
                    value={values.role}
                    onChange={(e) => set("role", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* LOCATION & WORK TYPE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Location</Label>

                  <Input
                    value={values.location}
                    onChange={(e) => set("location", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Work Type</Label>

                  <Select
                    value={values.workType || "on-site"}
                    onValueChange={(v) => set("workType", v)}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>

                      <SelectItem value="hybrid">Hybrid</SelectItem>

                      <SelectItem value="on-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SALARY & STATUS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Salary</Label>

                  <Input
                    value={values.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>

                  <Select
                    value={values.status || "saved"}
                    onValueChange={(v) => set("status", v)}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>

                      <SelectItem value="applied">Applied</SelectItem>

                      <SelectItem value="phone-screen">Phone Screen</SelectItem>

                      <SelectItem value="interview">Interview</SelectItem>

                      <SelectItem value="offer">Offer</SelectItem>

                      <SelectItem value="rejected">Rejected</SelectItem>

                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DATE & URL */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Applied Date</Label>

                  <Input
                    type="date"
                    value={values.appliedDate}
                    onChange={(e) => set("appliedDate", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Job URL</Label>

                  <Input
                    value={values.url}
                    onChange={(e) => set("url", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* CONTACT */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Contact Name</Label>

                  <Input
                    value={values.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Email</Label>

                  <Input
                    type="email"
                    value={values.contactEmail}
                    onChange={(e) => set("contactEmail", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* TAGS */}

              <div className="space-y-2">
                <Label>Tags</Label>

                <Input
                  value={values.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="React, Next.js, Remote"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* NOTES */}

              <div className="space-y-2">
                <Label>Notes</Label>

                <Textarea
                  rows={5}
                  value={values.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className="rounded-2xl resize-none"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/applications")}
                  className="h-12 rounded-xl px-6"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-xl px-8 bg-black hover:bg-zinc-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
