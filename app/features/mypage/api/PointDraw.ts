import { t } from "@app/i18n/store";
import { ApiError, api } from "@app/lib/api";
import type { DrawResponse } from "../model/Draw";
import { showError } from "../utils/alert";

export async function drawPoint(): Promise<DrawResponse> {
  try {
    return await api.post<DrawResponse>("/point-shop/draw");
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      const message = t("mypage.gacha.insufficientBalance");
      showError(message);
      throw new Error(message);
    }
    console.error("포인트 뽑기 실행 실패:", e);
    throw e;
  }
}
