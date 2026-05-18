// hooks/use-application-form.ts
import { useState, useCallback, useEffect } from "react";
import { applicationSchema, ApplicationFormValues } from "@/lib/validation";
import { JobApplication, ApplicationStatus, WorkType } from "@/types/job";
import { z } from "zod";

interface UseApplicationFormProps {
  initialValues?: Partial<JobApplication>;
  onSubmit: (
    data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
}

export function useApplicationForm({
  initialValues,
  onSubmit,
}: UseApplicationFormProps) {
  // Default values matching Zod schema
  const getDefaultValues = (): Partial<ApplicationFormValues> => ({
    company: "",
    role: "",
    location: "",
    workType: "remote" as WorkType,
    status: "saved" as ApplicationStatus,
    appliedDate: new Date().toISOString().split("T")[0], // today's date
    salary: "",
    url: "",
    contactName: "",
    contactEmail: "",
    notes: "",
    tags: [],
  });

  const [values, setValues] = useState<Partial<ApplicationFormValues>>({
    ...getDefaultValues(),
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialState, setInitialState] = useState(values);

  useEffect(() => {
    // Reset when initialValues change (e.g., editing)
    const newInitial = {
      ...getDefaultValues(),
      ...initialValues,
    };
    setValues(newInitial);
    setInitialState(newInitial);
  }, [initialValues]);

  const handleChange = useCallback(
    (field: string, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear error for that field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors],
  );

  const validate = useCallback((): Record<string, string> => {
    try {
      applicationSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        return newErrors;
      }
      return {};
    }
  }, [values]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data for API (all required fields are guaranteed by Zod)
    const submitData = values as Omit<
      JobApplication,
      "id" | "createdAt" | "updatedAt"
    >;
    await onSubmit(submitData);
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialState);

  return {
    values,
    handleChange,
    errors,
    handleSubmit,
    reset,
    isDirty,
  };
}
