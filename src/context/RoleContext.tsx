"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/types";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userEmail: string;
}

const RoleContext = createContext<RoleContextType>({
  role: "Retailer",
  setRole: () => {},
  userName: "Ramesh Sharma",
  userEmail: "retailer@stockpilot.ai",
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>("Retailer");

  useEffect(() => {
    const savedRole = localStorage.getItem("stockpilot_role") as UserRole;
    if (savedRole && ["Retailer", "Manager", "Admin"].includes(savedRole)) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("stockpilot_role", newRole);
  };

  const getUserDetails = () => {
    switch (role) {
      case "Manager":
        return { name: "Anita Gupta", email: "anita.manager@stockpilot.ai" };
      case "Admin":
        return { name: "Suresh Kumar", email: "suresh.admin@stockpilot.ai" };
      default:
        return { name: "Ramesh Sharma", email: "ramesh.retailer@stockpilot.ai" };
    }
  };

  const details = getUserDetails();

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        userName: details.name,
        userEmail: details.email,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
