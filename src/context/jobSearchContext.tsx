// context/job-search-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { isInCurrentWeek } from "@/lib/utils";

interface JobSearchContextValue {
  targetRole: string;
  setTargetRole: (role: string) => void;
  targetSalary: string;
  setTargetSalary: (salary: string) => void;
  weeklyGoal: number;
  setWeeklyGoal: (n: number) => void;
  goalProgress: number;
}

const JobSearchContext = createContext<JobSearchContextValue | undefined>(undefined);

export function JobSearchProvider({ children }: { children: React.ReactNode }) {
  const [targetRole, setTargetRole] = useState("");
  const [targetSalary, setTargetSalary] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  
  const applications = useSelector((state: RootState) => state.applications.applications);

  useEffect(() => {
    const storedRole = localStorage.getItem("targetRole");
    const storedSalary = localStorage.getItem("targetSalary");
    const storedGoal = localStorage.getItem("weeklyGoal");
    if (storedRole) setTargetRole(storedRole);
    if (storedSalary) setTargetSalary(storedSalary);
    if (storedGoal) setWeeklyGoal(parseInt(storedGoal, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem("targetRole", targetRole);
  }, [targetRole]);

  useEffect(() => {
    localStorage.setItem("targetSalary", targetSalary);
  }, [targetSalary]);

  useEffect(() => {
    localStorage.setItem("weeklyGoal", weeklyGoal.toString());
  }, [weeklyGoal]);

  const goalProgress = applications.filter(app => 
    app.status !== "saved" && isInCurrentWeek(app.appliedDate)
  ).length;

  return (
    <JobSearchContext.Provider
      value={{
        targetRole,
        setTargetRole,
        targetSalary,
        setTargetSalary,
        weeklyGoal,
        setWeeklyGoal,
        goalProgress,
      }}
    >
      {children}
    </JobSearchContext.Provider>
  );
}

export function useJobSearch() {
  const context = useContext(JobSearchContext);
  if (!context) {
    throw new Error("useJobSearch must be used within JobSearchProvider");
  }
  return context;
}