import { httpClient } from "@join/api/api";
import type { PersonalInfoApiValues } from "./PersonalInfo.schema";

export const fetchPersonalInfoData =
  async (): Promise<PersonalInfoApiValues> => {
    return httpClient.get<PersonalInfoApiValues>("/members");
  };

export const submitPersonalInfoData = async (data: PersonalInfoApiValues) => {
  return httpClient.post("/members", data);
};
