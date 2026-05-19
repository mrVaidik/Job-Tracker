import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { JobApplication, ApplicationFilters } from "@/types/job";

interface ApplicationState {
  applications: JobApplication[];
  filters: ApplicationFilters;
  selectedApplication: JobApplication | null;
  viewMode: "list" | "kanban";

  // FIXED
  status: "idle" | "loading" | "succeeded" | "failed";

  initialized: boolean;
  error: string | null;
}

const STORAGE_KEY = "job-tracker-applications";
const VIEW_MODE_KEY = "job-tracker-view-mode";

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

export const getStoredViewMode = (): "list" | "kanban" => {
  if (typeof window === "undefined") return "list";

  const mode = localStorage.getItem(VIEW_MODE_KEY);

  return mode === "kanban" ? "kanban" : "list";
};

const saveViewMode = (mode: "list" | "kanban") => {
  if (typeof window === "undefined") return;

  localStorage.setItem(VIEW_MODE_KEY, mode);
};

const initialState: ApplicationState = {
  applications: [],

  filters: {
    status: "all",
    workType: "all",
    search: "",
    tags: [],
  },

  selectedApplication: null,

  viewMode: typeof window !== "undefined" ? getStoredViewMode() : "list",

  // FIXED
  status: "idle",

  initialized: false,
  error: null,
};

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async () => {
    return getStoredApplications();
  },
);

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

    const updatedApplications = [newApplication, ...applications];

    saveStoredApplications(updatedApplications);

    return newApplication;
  },
);

export const editApplication = createAsyncThunk(
  "applications/editApplication",
  async ({ id, data }: { id: string; data: Partial<JobApplication> }) => {
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

    return updatedApplications.find((app) => app.id === id)!;
  },
);

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id: string) => {
    const applications = getStoredApplications();

    const updatedApplications = applications.filter((app) => app.id !== id);

    saveStoredApplications(updatedApplications);

    return id;
  },
);

const applicationSlice = createSlice({
  name: "applications",

  initialState,

  reducers: {
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

      saveViewMode(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.initialized = true;
        state.applications = action.payload;
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.initialized = true;
        state.error = action.error.message || "Failed to fetch applications";
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

export const { setFilters, clearFilters, setSelectedApplication, setViewMode } =
  applicationSlice.actions;

export default applicationSlice.reducer;
