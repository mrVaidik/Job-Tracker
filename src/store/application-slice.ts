// store/application-slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { JobApplication, ApplicationFilters } from "@/types/job";

// ─────────────────────────────────────────────

interface ApplicationState {
  applications: JobApplication[];

  filters: ApplicationFilters;

  selectedApplication: JobApplication | null;

  viewMode: "list" | "kanban";

  status: "idle" | "loading" | "succeeded" | "failed";

  error: string | null;
}

// ─────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────

const STORAGE_KEY = "job-tracker-applications";

const getStoredApplications = (): JobApplication[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveStoredApplications = (applications: JobApplication[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

// ─────────────────────────────────────────────

const initialState: ApplicationState = {
  applications: [],

  filters: {
    status: "all",

    workType: "all",

    search: "",

    tags: [],
  },

  selectedApplication: null,

  viewMode: "list",

  status: "idle",

  error: null,
};

// ─────────────────────────────────────────────
// FETCH
// ─────────────────────────────────────────────

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",

  async () => {
    return getStoredApplications();
  },
);

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export const createApplication = createAsyncThunk(
  "applications/createApplication",

  async (data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => {
    const applications = getStoredApplications();

    const newApplication: JobApplication = {
      id: crypto.randomUUID(),

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),

      ...data,
    };

    const updated = [newApplication, ...applications];

    saveStoredApplications(updated);

    return newApplication;
  },
);

// ─────────────────────────────────────────────
// EDIT
// ─────────────────────────────────────────────

export const editApplication = createAsyncThunk(
  "applications/editApplication",

  async ({
    id,
    data,
  }: {
    id: string;

    data: Partial<JobApplication>;
  }) => {
    const applications = getStoredApplications();

    const updatedApplications = applications.map((app) =>
      app.id === id
        ? {
            ...app,
            ...data,
            updatedAt: new Date().toISOString(),
          }
        : app,
    );

    saveStoredApplications(updatedApplications);

    const updatedApplication = updatedApplications.find((app) => app.id === id);

    return updatedApplication!;
  },
);

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",

  async (id: string) => {
    // ─────────────────────────────
    // DELETE APPLICATIONS
    // ─────────────────────────────

    const applications = getStoredApplications();

    const updatedApplications = applications.filter((app) => app.id !== id);

    saveStoredApplications(updatedApplications);

    // ─────────────────────────────
    // DELETE RELATED INTERVIEWS
    // ─────────────────────────────

    if (typeof window !== "undefined") {
      const interviewsRaw = localStorage.getItem("job-tracker-interviews");

      if (interviewsRaw) {
        const interviews = JSON.parse(interviewsRaw);

        const updatedInterviews = interviews.filter(
          (interview: any) => interview.applicationId !== id,
        );

        localStorage.setItem(
          "job-tracker-interviews",
          JSON.stringify(updatedInterviews),
        );
      }
    }

    return id;
  },
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const applicationSlice = createSlice({
  name: "applications",

  initialState,

  reducers: {
    setApplications: (state, action: PayloadAction<JobApplication[]>) => {
      state.applications = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<ApplicationFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    setSelectedApplication: (
      state,
      action: PayloadAction<JobApplication | null>,
    ) => {
      state.selectedApplication = action.payload;
    },

    setViewMode: (state, action: PayloadAction<"list" | "kanban">) => {
      state.viewMode = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH

      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";

        state.error = null;
      })

      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.applications = action.payload;
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message || "Failed to fetch";
      })

      // CREATE

      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);
      })

      // EDIT

      .addCase(editApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id,
        );

        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })

      // DELETE

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app.id !== action.payload,
        );
      });
  },
});

// ─────────────────────────────────────────────

export const {
  setApplications,
  setFilters,
  clearFilters,
  setSelectedApplication,
  setViewMode,
} = applicationSlice.actions;

// ─────────────────────────────────────────────

export default applicationSlice.reducer;
