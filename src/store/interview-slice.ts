import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { Interview } from "@/types/job";

const STORAGE_KEY = "job-tracker-interviews";

const getStoredInterviews = (): Interview[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveStoredInterviews = (interviews: Interview[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
};

interface InterviewState {
  interviews: Interview[];

  status: "idle" | "loading" | "succeeded" | "failed";

  loading: boolean;

  error: string | null;
}

const initialState: InterviewState = {
  interviews: [],

  status: "loading",

  loading: true,

  error: null,
};
export const fetchInterviews = createAsyncThunk(
  "interviews/fetchInterviews",

  async (applicationId?: string) => {
    const interviews = getStoredInterviews();

    if (!applicationId) {
      return interviews;
    }

    return interviews.filter((i) => i.applicationId === applicationId);
  },
);

export const scheduleInterview = createAsyncThunk(
  "interviews/scheduleInterview",

  async (data: Omit<Interview, "id">) => {
    const interviews = getStoredInterviews();

    const newInterview: Interview = {
      id: crypto.randomUUID(),

      ...data,
    };

    const updated = [newInterview, ...interviews];

    saveStoredInterviews(updated);

    return newInterview;
  },
);

export const editInterview = createAsyncThunk(
  "interviews/editInterview",

  async ({
    id,
    data,
  }: {
    id: string;

    data: Partial<Interview>;
  }) => {
    const interviews = getStoredInterviews();

    const updatedInterviews = interviews.map((i) =>
      i.id === id
        ? {
            ...i,
            ...data,
          }
        : i,
    );

    saveStoredInterviews(updatedInterviews);

    const updatedInterview = updatedInterviews.find((i) => i.id === id);

    return updatedInterview!;
  },
);

export const cancelInterview = createAsyncThunk(
  "interviews/cancelInterview",

  async (id: string) => {
    const interviews = getStoredInterviews();

    const updated = interviews.filter((i) => i.id !== id);

    saveStoredInterviews(updated);

    return id;
  },
);

const interviewSlice = createSlice({
  name: "interviews",

  initialState,

  reducers: {
    setInterviews: (state, action: PayloadAction<Interview[]>) => {
      state.interviews = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchInterviews.pending, (state) => {
        state.status = "loading";

        state.loading = true;

        state.error = null;
      })

      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.loading = false;

        state.interviews = action.payload;
      })

      .addCase(fetchInterviews.rejected, (state, action) => {
        state.status = "failed";

        state.loading = false;

        state.error = action.error.message || "Failed to fetch interviews";
      })

      .addCase(scheduleInterview.pending, (state) => {
        state.loading = true;
      })

      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.loading = false;

        state.interviews.unshift(action.payload);
      })

      .addCase(scheduleInterview.rejected, (state) => {
        state.loading = false;
      })

      .addCase(editInterview.pending, (state) => {
        state.loading = true;
      })

      .addCase(editInterview.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.interviews.findIndex(
          (i) => i.id === action.payload.id,
        );

        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
      })

      .addCase(editInterview.rejected, (state) => {
        state.loading = false;
      })

      .addCase(cancelInterview.pending, (state) => {
        state.loading = true;
      })

      .addCase(cancelInterview.fulfilled, (state, action) => {
        state.loading = false;

        state.interviews = state.interviews.filter(
          (i) => i.id !== action.payload,
        );
      })

      .addCase(cancelInterview.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setInterviews } = interviewSlice.actions;

export default interviewSlice.reducer;
