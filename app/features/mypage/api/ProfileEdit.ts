import { api, getApiErrorMessage } from "@app/lib/api";

export async function ProfileEdit(iconkey: string): Promise<void> {
  try {
    await api.put("/members/profile-icon", { profileIcon: iconkey });
  } catch (e) {
    console.error("프로필 아이콘 저장 실패:", e);
    throw new Error(getApiErrorMessage(e, "프로필 아이콘 저장 실패"));
  }
}
