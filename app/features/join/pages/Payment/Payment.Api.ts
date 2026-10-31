import { api } from "@app/lib/api";

export const makePayment = (selectedCoupons: number[]) =>
  api.post("/payments", { issuedCouponIds: selectedCoupons });

interface PaymentPollingResult {
  status: "NOT_CREATED" | "PENDING" | "COMPLETED";
  finalPrice: number;
}

export const pollPaymentStatus = () =>
  api.get<PaymentPollingResult>("/payments/status");
