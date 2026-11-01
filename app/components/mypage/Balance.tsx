import { useI18n } from "@app/i18n";
import { formatNumber } from "@app/lib/format";

export function Balance({ amount }: { amount: number }) {
  const { t } = useI18n();
  return (
    <p className="m-0 grid gap-1">
      <span className="text-[0.8125rem] font-[700] text-ink-muted">
        {t("mypage.balance")}
      </span>
      <span className="tabular text-[1.75rem] leading-none font-[820] tracking-[-0.04em]">
        {formatNumber(amount)}
        <span className="ml-0.5 text-[0.6em] font-[750] text-ink-muted">
          {t("mypage.pointUnit")}
        </span>
      </span>
    </p>
  );
}
