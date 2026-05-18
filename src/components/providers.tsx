// components/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { JobSearchProvider } from "@/context/jobSearchContext";
import { Sidebar } from "./Sidebar";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <JobSearchProvider>
        <div className="flex min-h-screen">
          <Sidebar/>
          <main className="flex-1 md:ml-72 overflow-auto">
            {children}
          </main>
        </div>
      </JobSearchProvider>
    </Provider>
  );
}