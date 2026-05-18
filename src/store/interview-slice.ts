// store/interview-slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { Interview } from "@/types/job";

// ─────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────

const STORAGE_KEY = "job-tracker-interviews";

// ─────────────────────────────────────────────

const getStoredInterviews = (): Interview[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ─────────────────────────────────────────────

const saveStoredInterviews = (interviews: Interview[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
};

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

interface InterviewState {
  interviews: Interview[];

  status: "idle" | "loading" | "succeeded" | "failed";

  error: string | null;
}

// ─────────────────────────────────────────────

const initialState: InterviewState = {
  interviews: [],

  status: "idle",

  error: null,
};

// ─────────────────────────────────────────────
// FETCH
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// EDIT
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export const cancelInterview = createAsyncThunk(
  "interviews/cancelInterview",

  async (id: string) => {
    const interviews = getStoredInterviews();

    const updated = interviews.filter((i) => i.id !== id);

    saveStoredInterviews(updated);

    return id;
  },
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

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

      // FETCH

      .addCase(fetchInterviews.pending, (state) => {
        state.status = "loading";

        state.error = null;
      })

      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.interviews = action.payload;
      })

      .addCase(fetchInterviews.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message || "Failed to fetch interviews";
      })

      // CREATE

      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.interviews.unshift(action.payload);
      })

      // EDIT

      .addCase(editInterview.fulfilled, (state, action) => {
        const index = state.interviews.findIndex(
          (i) => i.id === action.payload.id,
        );

        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
      })

      // DELETE

      .addCase(cancelInterview.fulfilled, (state, action) => {
        state.interviews = state.interviews.filter(
          (i) => i.id !== action.payload,
        );
      });
  },
});

// ─────────────────────────────────────────────

export const { setInterviews } = interviewSlice.actions;

// ─────────────────────────────────────────────

export default interviewSlice.reducer;
