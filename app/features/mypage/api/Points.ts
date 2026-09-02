import type {
  PointSummaryView,
  PointTransactionView,
  RawPointSummaryRes,
  RawPointTransaction,
} from "../model/Points";

type ApiResp<T> = { data: T } | T;

function unwrap<T>(j: ApiResp<T>): T {
  return typeof j === "object" && j !== null && "data" in j
    ? (j as { data: T }).data
    : (j as T);
}

export async function getPointSummary(): Promise<PointSummaryView> {
  const response =
    await api.get<ApiResp<RawPointSummaryRes>>("/points/summary");
  const data = unwrap<RawPointSummaryRes>(response);
  const balance: number = Number(data.balance ?? 0);

  const rawList: unknown = Array.isArray(data.history) ? data.history : [];

  const list: RawPointTransaction[] = Array.isArray(rawList) ? rawList : [];

  const history: PointTransactionView[] = list
    .map<PointTransactionView>((t) => {
      const isEarn = t.transactionType === "EARN";
      const sign: "+" | "-" = isEarn ? "+" : "-";
      const label: "적립" | "사용" = isEarn ? "적립" : "사용";

      return {
        ...t,
        sign,
        label,
        signedAmount: isEarn ? t.amount : -t.amount,
      };
    })
    // pointTransactionId 오름차순 정렬
    .sort((a, b) => b.pointTransactionId - a.pointTransactionId);

  return { balance, history };
}

import { api } from "@app/lib/api";
