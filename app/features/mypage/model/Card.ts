// 포인트 카드용 props
export interface PointCardProps {
  type: "point";
  title: string;
  date: string;
  amount: number;
}

// 쿠폰 카드용 props
export interface CouponCardProps {
  type: "coupon";
  price: string;
  desc: string;
  /** API 상태를 그대로 쓰지 않고 표시 언어와 무관한 값으로 둡니다. */
  status: "UNUSED" | "USED";
}

// 뽑기내역 카드용 props
export interface HistoryCardProps {
  type: "history";
  title: string;
  date: string;
}

export type CardProps = PointCardProps | CouponCardProps | HistoryCardProps;
