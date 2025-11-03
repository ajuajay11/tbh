// app/dashboard/context/UserContext.tsx
"use client";

import { createContext, useContext } from "react";
import { Chronicle, User } from "../../types/chronicle";

interface UserContextType {
  chronicles: Chronicle[];
  userData: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, chronicles, userData}: { children: React.ReactNode; chronicles: Chronicle[]; userData: User; }) {
  return (
    <UserContext.Provider value={{ chronicles, userData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
