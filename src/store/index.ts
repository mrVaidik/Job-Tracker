import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./application-slice";
import interviewReducer from "./interview-slice";

export const store = configureStore({
  reducer: {
    applications: applicationReducer,
    interviews: interviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
