import { useI18n } from "@app/i18n";

interface PaymentAmountProps {
  amount: number;
}

const PaymentAmount = ({ amount }: PaymentAmountProps) => {
  const { t } = useI18n();

  return (
    <div className="mt-2 p-2 text-center">
      <span className="font-bold text-5xl">{amount.toLocaleString()}</span>
      <span className="text-lg">{t("join.payment.currencyUnit")}</span>
    </div>
  );
};

export default PaymentAmount;
