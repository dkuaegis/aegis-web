import { getAxiosErrorMessage, mypageApiClient } from "./client";

export async function ProfileEdit(iconkey: string): Promise<void> {
  try {
    await mypageApiClient.put(
      "/members/profile-icon",
      { profileIcon: iconkey },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
  } catch (e) {
    console.error("프로필 아이콘 저장 실패:", e);
    throw new Error(getAxiosErrorMessage(e, "프로필 아이콘 저장 실패"));
  }
}
