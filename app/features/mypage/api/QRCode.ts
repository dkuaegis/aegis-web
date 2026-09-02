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
    throw new Error(getApiErrorMessage(error, "QR 코드 발급 실패"));
  }
}
