import type { ApplicationState } from "@study/types/application";
import { createContext, useContext } from "react";

const ApplicationStateContext = createContext<ApplicationState | null>(null);

export const useApplicationState = () => {
  const context = useContext(ApplicationStateContext);
  if (!context) {
    throw new Error(
      "useApplicationState must be used within an ApplicationStateContext.Provider"
    );
  }
  return context;
};

export default ApplicationStateContext;
