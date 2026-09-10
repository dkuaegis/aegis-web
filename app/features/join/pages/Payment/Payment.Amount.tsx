interface PaymentAmountProps {
  amount: number;
}

const PaymentAmount = ({ amount }: PaymentAmountProps) => (
  <section className="join-payment-summary" aria-label="납부 금액">
    <div>
      <span>납부 금액</span>
      <strong>{amount.toLocaleString()}원</strong>
    </div>
  </section>
);

export default PaymentAmount;
