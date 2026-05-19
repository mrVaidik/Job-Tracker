
"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  createApplication,
  fetchApplications,
} from "@/store/application-slice";

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { WorkType, ApplicationStatus } from "@/types/job";

import { useState, useCallback } from "react";

import { AlertCircle, CheckCircle2, BriefcaseBusiness } from "lucide-react";


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

type ValidationErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL: FormValues = {
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
};

function isValidUrl(raw: string): boolean {
  const s = raw.trim();

  if (!s) return false;

  const withProtocol = /^https?:\/\//i.test(s) ? s : `https://${s}`;

  try {
    const url = new URL(withProtocol);

    const hostname = url.hostname;

    if (!hostname.includes(".")) {
      return false;
    }

    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    return domainRegex.test(hostname);
  } catch {
    return false;
  }
}

function normalizeUrl(raw: string): string {
  const s = raw.trim();

  if (!s) return "";

  if (/^https?:\/\//i.test(s)) {
    return s;
  }

  return `https://${s}`;
}

function isValidEmail(email: string): boolean {
  const s = email.trim();

  if (!s) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (s.includes("..") || s.startsWith(".") || s.endsWith(".")) {
    return false;
  }

  return emailRegex.test(s);
}

function isValidName(name: string): boolean {
  const s = name.trim();

  if (s.length < 2) return false;

  return /^[a-zA-Z\s.'-]+$/.test(s);
}

function isValidCompany(company: string): boolean {
  const s = company.trim();

  if (s.length < 2) return false;

  return /^[a-zA-Z0-9\s.&'-]+$/.test(s);
}

function isValidRole(role: string): boolean {
  const s = role.trim();

  if (s.length < 2) return false;

  return /^[a-zA-Z0-9\s\-/.()]+$/.test(s);
}

function isValidSalary(salary: string): boolean {
  const s = salary.trim();

  if (!s) return false;

  return /^[0-9₹$€,.\skKLM\-+]+$/.test(s);
}

function validateTags(tagsString: string): {
  isValid: boolean;
  error?: string;
  tags: string[];
} {
  const trimmed = tagsString.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "At least one tag is required",
      tags: [],
    };
  }

  const tags = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const uniqueTags = [...new Set(tags)];

  if (uniqueTags.length === 0) {
    return {
      isValid: false,
      error: "At least one tag is required",
      tags: [],
    };
  }

  if (uniqueTags.length > 10) {
    return {
      isValid: false,
      error: "Maximum 10 tags allowed",
      tags: [],
    };
  }

  return {
    isValid: true,
    tags: uniqueTags,
  };
}

function validate(v: FormValues): ValidationErrors {
  const e: ValidationErrors = {};

  if (!v.company.trim()) {
    e.company = "Company name is required";
  } else if (!isValidCompany(v.company)) {
    e.company = "Enter a valid company name";
  }

  if (!v.role.trim()) {
    e.role = "Role is required";
  } else if (!isValidRole(v.role)) {
    e.role = "Enter a valid role";
  }

  if (!v.location.trim()) {
    e.location = "Location is required";
  } else if (v.location.trim().length < 2) {
    e.location = "Enter a valid location";
  }

  if (!v.salary.trim()) {
    e.salary = "Salary is required";
  } else if (!isValidSalary(v.salary)) {
    e.salary = "Enter a valid salary";
  }

  if (!v.url.trim()) {
    e.url = "Job URL is required";
  } else if (!isValidUrl(v.url)) {
    e.url = "Enter a valid website URL";
  }

  if (!v.contactName.trim()) {
    e.contactName = "Contact name is required";
  } else if (!isValidName(v.contactName)) {
    e.contactName = "Enter a valid name";
  }

  if (!v.contactEmail.trim()) {
    e.contactEmail = "Email is required";
  } else if (!isValidEmail(v.contactEmail)) {
    e.contactEmail = "Enter a valid email";
  }

  if (!v.appliedDate.trim()) {
    e.appliedDate = "Applied date required";
  } else {
    const selectedDate = new Date(v.appliedDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      e.appliedDate = "Future date not allowed";
    }
  }

  if (v.notes && v.notes.trim().length > 1000) {
    e.notes = "Notes must be under 1000 characters";
  }

  const tagValidation = validateTags(v.tags);

  if (!tagValidation.isValid) {
    e.tags = tagValidation.error;
  }

  return e;
}


function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;

  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="h-3 w-3" />
      {msg}
    </p>
  );
}

function StatusIcon({ error, valid }: { error?: string; valid: boolean }) {
  if (valid) {
    return (
      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
    );
  }

  if (error) {
    return (
      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
    );
  }

  return null;
}

function inputCls(error?: string, valid?: boolean) {
  const base =
    "h-12 rounded-xl border-zinc-200 bg-white shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";

  if (error) return `${base} border-red-500 focus:ring-red-500/20`;

  if (valid) return `${base} border-green-500 focus:ring-green-500/20`;

  return base;
}

export default function AddApplicationPage() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [values, setValues] = useState<FormValues>(INITIAL);

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const touch = useCallback((field: keyof FormValues) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  const errors = validate(values);

  const hasErrors = Object.keys(errors).length > 0;

  const err = (f: keyof FormValues) => (touched[f] ? errors[f] : undefined);

  const ok = (f: keyof FormValues) => !!(touched[f] && !errors[f] && values[f]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);

    const allTouched = (Object.keys(INITIAL) as Array<keyof FormValues>).reduce(
      (acc, k) => ({
        ...acc,
        [k]: true,
      }),
      {} as Partial<Record<keyof FormValues, boolean>>,
    );

    setTouched(allTouched);

    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      const tagsValidation = validateTags(values.tags);

      await dispatch(
        createApplication({
          company: values.company.trim(),
          role: values.role.trim(),
          location: values.location.trim(),
          workType: values.workType,
          salary: values.salary.trim(),
          status: values.status,
          appliedDate: values.appliedDate,
          url: normalizeUrl(values.url),
          contactName: values.contactName.trim(),
          contactEmail: values.contactEmail.trim(),
          notes: values.notes,
          tags: tagsValidation.tags,
        }),
      ).unwrap();

      await dispatch(fetchApplications()).unwrap();

      router.push("/applications");
    } catch (error) {
      console.error(error);

      setSubmitError("Failed to save application.");

      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur transition-all duration-300">
          {/* HEADER */}

          <CardHeader className="border-b pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Job Tracker
                </div>

                <CardTitle className="text-3xl font-bold tracking-tight">
                  Add New Application
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Organize and manage all your job applications professionally.
                </p>
              </div>
            </div>
          </CardHeader>

          {/* CONTENT */}

          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* COMPANY & ROLE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-sm font-semibold text-zinc-800"
                  >
                    Company
                  </Label>

                  <div className="relative">
                    <Input
                      id="company"
                      value={values.company}
                      onChange={(e) => set("company", e.target.value)}
                      onBlur={() => touch("company")}
                      placeholder="Google, Microsoft..."
                      className={inputCls(err("company"), ok("company"))}
                    />

                    <StatusIcon error={err("company")} valid={ok("company")} />
                  </div>

                  <FieldError msg={err("company")} />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-semibold text-zinc-800"
                  >
                    Role
                  </Label>

                  <div className="relative">
                    <Input
                      id="role"
                      value={values.role}
                      onChange={(e) => set("role", e.target.value)}
                      onBlur={() => touch("role")}
                      placeholder="Frontend Developer"
                      className={inputCls(err("role"), ok("role"))}
                    />

                    <StatusIcon error={err("role")} valid={ok("role")} />
                  </div>

                  <FieldError msg={err("role")} />
                </div>
              </div>

              {/* LOCATION */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Location
                  </Label>

                  <div className="relative">
                    <Input
                      value={values.location}
                      onChange={(e) => set("location", e.target.value)}
                      onBlur={() => touch("location")}
                      placeholder="San Francisco, CA"
                      className={inputCls(err("location"), ok("location"))}
                    />

                    <StatusIcon
                      error={err("location")}
                      valid={ok("location")}
                    />
                  </div>

                  <FieldError msg={err("location")} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Work Type
                  </Label>

                  <Select
                    value={values.workType}
                    onValueChange={(v) => set("workType", v)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-zinc-200 shadow-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>

                      <SelectItem value="hybrid">Hybrid</SelectItem>

                      <SelectItem value="on-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SALARY */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Salary
                  </Label>

                  <Input
                    value={values.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    onBlur={() => touch("salary")}
                    placeholder="$120,000"
                    className={inputCls(err("salary"), ok("salary"))}
                  />

                  <FieldError msg={err("salary")} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Status
                  </Label>

                  <Select
                    value={values.status}
                    onValueChange={(v) => set("status", v)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-zinc-200 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>

                      <SelectItem value="applied">Applied</SelectItem>

                      <SelectItem value="interview">Interview</SelectItem>

                      <SelectItem value="offer">Offer</SelectItem>

                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DATE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Applied Date
                  </Label>

                  <Input
                    type="date"
                    value={values.appliedDate}
                    onChange={(e) => set("appliedDate", e.target.value)}
                    onBlur={() => touch("appliedDate")}
                    className={inputCls(err("appliedDate"), ok("appliedDate"))}
                  />

                  <FieldError msg={err("appliedDate")} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Job URL
                  </Label>

                  <div className="relative">
                    <Input
                      value={values.url}
                      onChange={(e) => set("url", e.target.value)}
                      onBlur={() => touch("url")}
                      placeholder="https://company.com"
                      className={inputCls(err("url"), ok("url"))}
                    />

                    <StatusIcon error={err("url")} valid={ok("url")} />
                  </div>

                  <FieldError msg={err("url")} />
                </div>
              </div>

              {/* CONTACT */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Contact Name
                  </Label>

                  <Input
                    value={values.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    onBlur={() => touch("contactName")}
                    placeholder="Jane Smith"
                    className={inputCls(err("contactName"), ok("contactName"))}
                  />

                  <FieldError msg={err("contactName")} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-800">
                    Contact Email
                  </Label>

                  <div className="relative">
                    <Input
                      type="email"
                      value={values.contactEmail}
                      onChange={(e) => set("contactEmail", e.target.value)}
                      onBlur={() => touch("contactEmail")}
                      placeholder="jane@example.com"
                      className={inputCls(
                        err("contactEmail"),
                        ok("contactEmail"),
                      )}
                    />

                    <StatusIcon
                      error={err("contactEmail")}
                      valid={ok("contactEmail")}
                    />
                  </div>

                  <FieldError msg={err("contactEmail")} />
                </div>
              </div>

              {/* TAGS */}

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-zinc-800">
                  Tags
                </Label>

                <Input
                  value={values.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  onBlur={() => touch("tags")}
                  placeholder="React, Next.js, Startup"
                  className={inputCls(err("tags"), ok("tags"))}
                />

                <FieldError msg={err("tags")} />
              </div>

              {/* NOTES */}

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-zinc-800">
                  Notes
                </Label>

                <Textarea
                  rows={5}
                  value={values.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Additional notes..."
                  className={`min-h-[140px] rounded-2xl border-zinc-200 shadow-sm resize-none ${
                    err("notes") ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* ERROR */}

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />

                    <p className="text-sm">{submitError}</p>
                  </div>
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="h-12 rounded-xl px-6"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-xl px-8 bg-black hover:bg-zinc-800"
                >
                  {isSubmitting ? "Saving..." : "Save Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
