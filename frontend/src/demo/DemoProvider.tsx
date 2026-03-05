// src/demo/DemoProvider.tsx
// Wrap your app (or just the demo route) with this provider.
// Any component can call useDemoContext() to get demo data and actions
// instead of making real API calls.

import React, { createContext, useContext } from "react";
import { useDemoPosts } from "./useDemoPosts";
import { DEMO_USER } from "./mockData";

type DemoContextType = ReturnType<typeof useDemoPosts> & {
  user: typeof DEMO_USER;
  isDemo: true;
};

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const demoPosts = useDemoPosts();

  return (
    <DemoContext.Provider value={{ ...demoPosts, user: DEMO_USER, isDemo: true }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoContext must be used inside <DemoProvider>");
  return ctx;
}
