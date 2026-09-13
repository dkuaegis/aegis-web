import { t } from "@app/i18n/store";
import { apiRequest, getApiErrorMessage } from "@app/lib/api";

export interface QRIssueRes {
  base64: string;
}

export async function issueQRCode(): Promise<string> {
  try {
    const data = await apiRequest<string>("/qrcode/issue", {
      method: "POST",
      body: "",
      headers: {
        accept: "text/plain",
        "Content-Type": "text/plain",
      },
    });
    return data.trim();
  } catch (error) {
    throw new Error(getApiErrorMessage(error, t("mypage.errors.qrIssue")));
  }
}
