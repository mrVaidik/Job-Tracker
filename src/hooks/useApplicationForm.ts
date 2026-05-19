import { useState, useCallback, useEffect } from "react";
import { applicationSchema, ApplicationFormValues } from "@/lib/validation";
import { JobApplication, ApplicationStatus, WorkType } from "@/types/job";
import { z } from "zod";

type FormValues = z.infer<typeof applicationSchema>;

interface UseApplicationFormProps {
  initialValues?: Partial<JobApplication>;
  onSubmit: (
    data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
}

function getDefaultValues(): FormValues {
  return {
    company: "",
    role: "",
    location: "",
    workType: "remote",
    status: "saved",
    appliedDate: new Date().toISOString().split("T")[0],
    salary: "",
    url: "",
    contactName: "",
    contactEmail: "",
    notes: "",
    tags: [],
  };
}

export function useApplicationForm({
  initialValues,
  onSubmit,
}: UseApplicationFormProps) {
  const computeInitialState = useCallback((): FormValues => {
    const defaults = getDefaultValues();
    if (!initialValues) return defaults;

    return {
      ...defaults,
      ...initialValues,

      tags: initialValues.tags ?? defaults.tags,
      workType: (initialValues.workType as WorkType) ?? defaults.workType,
      status: (initialValues.status as ApplicationStatus) ?? defaults.status,
    };
  }, [initialValues]);

  const [values, setValues] = useState<FormValues>(computeInitialState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialState, setInitialState] = useState<FormValues>(values);

  useEffect(() => {
    const newState = computeInitialState();
    setValues(newState);
    setInitialState(newState);
  }, [computeInitialState]);

  const handleChange = useCallback(
    <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
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
        error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (typeof path === "string") {
            newErrors[path] = issue.message;
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
