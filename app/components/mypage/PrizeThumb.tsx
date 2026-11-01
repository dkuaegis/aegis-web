import type { PointShopItem } from "@app/api/generated/model";
import { cn } from "@app/lib/utils";
import { PRIZES } from "./mypage";

/** The prize picture in a small rounded tile. */
export function PrizeThumb({
  code,
  className,
}: {
  code: PointShopItem;
  className?: string;
}) {
  const prize = PRIZES[code];
  return (
    <span
      className={cn(
        "grid aspect-square place-items-center rounded-thumb bg-paper-sunken p-1",
        className
      )}
    >
      {prize && (
        <img src={prize.thumb ?? prize.icon} alt="" className="max-h-full" />
      )}
    </span>
  );
}
