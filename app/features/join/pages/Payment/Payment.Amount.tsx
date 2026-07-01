interface PaymentAmountProps {
  amount: number;
}

const PaymentAmount = ({ amount }: PaymentAmountProps) => {
  return (
    <div className="mt-2 p-2 text-center">
      <span className="font-bold text-5xl">{amount.toLocaleString()}</span>
      <span className="text-lg"> 원</span>
    </div>
  );
};

export default PaymentAmount;
