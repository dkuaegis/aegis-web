import type { PersonalInfoFormValues } from "@join/pages/PersonalInfo/PersonalInfo.schema";
import { create } from "zustand";

interface PersonalInfoState {
  personalInfoData: PersonalInfoFormValues | null;
  setPersonalInfoData: (data: PersonalInfoFormValues) => void;
}

export const usePersonalInfoStore = create<PersonalInfoState>((set) => ({
  personalInfoData: null,
  setPersonalInfoData: (data: PersonalInfoFormValues) =>
    set((state) => ({ ...state, personalInfoData: data })),
}));
