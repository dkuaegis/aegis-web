import { t } from "@app/i18n/store";
import { ApiError, api, getApiErrorMessage } from "@app/lib/api";
import type { DrawResponse } from "../model/Draw";

export async function drawPoint(): Promise<DrawResponse> {
  try {
    return await api.post<DrawResponse>("/point-shop/draw");
  } catch (e) {
    console.error("포인트 뽑기 실행 실패:", e);
    if (e instanceof ApiError && e.status === 400) {
      throw new Error(t("mypage.gacha.insufficientBalance"));
    }
    throw new Error(getApiErrorMessage(e, t("mypage.errors.draw")));
  }
}
