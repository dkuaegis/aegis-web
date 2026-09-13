import { api } from "@app/lib/api";
import type { PersonalInfoApiValues } from "./PersonalInfo.schema";

export const fetchPersonalInfoData =
  async (): Promise<PersonalInfoApiValues> => {
    return api.get<PersonalInfoApiValues>("/members");
  };

export const submitPersonalInfoData = async (data: PersonalInfoApiValues) => {
  return api.post("/members", data);
};
