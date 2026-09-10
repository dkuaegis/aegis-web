export type PointType = "EARN" | "SPEND";

export interface RawPointTransaction {
  pointTransactionId: number;
  transactionType: PointType;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface RawPointSummaryRes {
  balance: number;
  history: RawPointTransaction[];
}

export interface PointTransactionView extends RawPointTransaction {
  sign: "+" | "-";
  /** 표시 문구는 `mypage.points.typeLabels`에서 가져옵니다. */
  labelKey: "EARN" | "SPEND";
  signedAmount: number;
}

export interface PointSummaryView {
  balance: number;
  history: PointTransactionView[];
}
