// store/interview-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Interview } from "@/types/job";

interface InterviewState {
  interviews: Interview[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InterviewState = {
  interviews: [],
  status: "idle",
  error: null,
};

export const fetchInterviews = createAsyncThunk(
  "interviews/fetchInterviews",
  async (applicationId?: string) => {
    const url = applicationId
      ? `/api/interviews?applicationId=${applicationId}`
      : "/api/interviews";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch interviews");
    return res.json() as Promise<Interview[]>;
  },
);

export const scheduleInterview = createAsyncThunk(
  "interviews/scheduleInterview",
  async (data: Omit<Interview, "id">) => {
    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to schedule interview");
    return res.json() as Promise<Interview>;
  },
);

export const editInterview = createAsyncThunk(
  "interviews/editInterview",
  async ({ id, data }: { id: string; data: Partial<Interview> }) => {
    const res = await fetch(`/api/interviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update interview");
    return res.json() as Promise<Interview>;
  },
);

export const cancelInterview = createAsyncThunk(
  "interviews/cancelInterview",
  async (id: string) => {
    const res = await fetch(`/api/interviews/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to cancel interview");
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
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.interviews.push(action.payload);
      })
      .addCase(editInterview.fulfilled, (state, action) => {
        const index = state.interviews.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) state.interviews[index] = action.payload;
      })
      .addCase(cancelInterview.fulfilled, (state, action) => {
        state.interviews = state.interviews.filter(
          (i) => i.id !== action.payload,
        );
      });
  },
});

export const { setInterviews } = interviewSlice.actions;
export default interviewSlice.reducer;
