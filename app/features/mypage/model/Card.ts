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
  status: "사용전" | "사용완료";
}

// 뽑기내역 카드용 props
export interface HistoryCardProps {
  type: "history";
  title: string;
  date: string;
}

export type CardProps = PointCardProps | CouponCardProps | HistoryCardProps;
