import { getAxiosErrorMessage, mypageApiClient } from "./client";

export interface QRIssueRes {
  base64: string;
}

export async function issueQRCode(): Promise<string> {
  try {
    const { data } = await mypageApiClient.post<string>("/qrcode/issue", "", {
      headers: {
        accept: "text/plain",
        "Content-Type": "text/plain",
      },
      responseType: "text",
    });
    return data.trim();
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error, "QR 코드 발급 실패"));
  }
}
