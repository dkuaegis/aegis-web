export const calculateTotalPoints = (history: { amount: number }[]): number => {
  return history.reduce((acc, cur) => acc + cur.amount, 0);
};
