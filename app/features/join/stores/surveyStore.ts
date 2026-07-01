import type { SurveyFormValues } from "@join/pages/Survey/Survey.schema";
import { create } from "zustand";

interface SurveyState {
  joinReason: string;
  acquisitionType: string | undefined;

  setFormValues: (values: Partial<SurveyFormValues>) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  joinReason: "",
  acquisitionType: undefined,

  setFormValues: (values) => {
    set((state) => ({
      ...state,
      ...values,
    }));
  },
}));
