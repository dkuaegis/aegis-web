import CouponIcon from "@join/assets/coupon.svg?react";
import { cn } from "@join/lib/utils";
import { Check } from "lucide-react";
import type { CouponItemProps } from "./Coupon.Types";

const CouponItem = ({ coupon, isSelected, setSelect }: CouponItemProps) => {
  return (
    <button
      type="button"
      onClick={() => setSelect(coupon.issuedCouponId)}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <CouponIcon className="h-8 w-12 shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className="truncate text-base text-slate-900">
          {coupon.couponName}
        </strong>
        <small className="text-slate-500">
          {coupon.discountAmount.toLocaleString()}원 할인
        </small>
      </span>
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
          isSelected
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-300 text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
  );
};

export default CouponItem;
