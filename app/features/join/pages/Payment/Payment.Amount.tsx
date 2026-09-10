import { useI18n } from "@app/i18n";

interface PaymentAmountProps {
  amount: number;
}

const PaymentAmount = ({ amount }: PaymentAmountProps) => {
  const { t } = useI18n();
  const label = t("join.payment.amountLabel");

  return (
    <section className="join-payment-summary" aria-label={label}>
      <div>
        <span>{label}</span>
        <strong>
          {t("join.payment.amountWithUnit", {
            amount: amount.toLocaleString(),
          })}
        </strong>
      </div>
    </section>
  );
};

export default PaymentAmount;
