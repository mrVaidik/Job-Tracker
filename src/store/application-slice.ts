// store/application-slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import {
  JobApplication,
  ApplicationFilters,
  ApplicationStatus,
  WorkType,
} from "@/types/job";

// ─────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────

const saveApplicationsToStorage = (applications: JobApplication[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("applications", JSON.stringify(applications));
  }
};

const loadApplicationsFromStorage = (): JobApplication[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("applications");

    if (saved) {
      return JSON.parse(saved);
    }
  }

  return [];
};

// ─────────────────────────────────────────────
// STATE
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

const initialState: ApplicationState = {
  applications: loadApplicationsFromStorage(),

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

  async (filters?: {
    status?: string;

    workType?: string;

    search?: string;

    tags?: string[];
  }) => {
    try {
      const params = new URLSearchParams();

      if (filters?.status && filters.status !== "all") {
        params.append("status", filters.status);
      }

      if (filters?.workType && filters.workType !== "all") {
        params.append("workType", filters.workType);
      }

      if (filters?.search) {
        params.append("search", filters.search);
      }

      if (filters?.tags?.length) {
        params.append("tags", filters.tags.join(","));
      }

      const res = await fetch(`/api/applications?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = (await res.json()) as JobApplication[];

      if (data && Array.isArray(data) && data.length > 0) {
        saveApplicationsToStorage(data);

        return data;
      }

      return loadApplicationsFromStorage();
    } catch (error) {
      console.error(error);

      return loadApplicationsFromStorage();
    }
  },
);

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export const createApplication = createAsyncThunk(
  "applications/createApplication",

  async (data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create application");
      }

      return (await res.json()) as JobApplication;
    } catch (error) {
      console.error(error);

      const newApplication: JobApplication = {
        id: crypto.randomUUID(),

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

        ...data,
      };

      return newApplication;
    }
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
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update application");
      }

      return (await res.json()) as JobApplication;
    } catch (error) {
      console.error(error);

      return {
        id,
        ...data,
      } as JobApplication;
    }
  },
);

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",

  async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete application");
      }

      return id;
    } catch (error) {
      console.error(error);

      return id;
    }
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

      saveApplicationsToStorage(action.payload);
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

        saveApplicationsToStorage(action.payload);
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message || "Failed to fetch";
      })

      // CREATE

      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);

        saveApplicationsToStorage(state.applications);
      })

      // EDIT

      .addCase(editApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id,
        );

        if (index !== -1) {
          state.applications[index] = {
            ...state.applications[index],

            ...action.payload,
          };

          saveApplicationsToStorage(state.applications);
        }
      })

      // DELETE

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app.id !== action.payload,
        );

        saveApplicationsToStorage(state.applications);
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
