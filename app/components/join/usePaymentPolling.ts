import { createPayment, getPaymentStatus } from "@app/api/generated/endpoints";
import {
  PaymentCheckStatus,
  type PaymentStatusResponse,
} from "@app/api/generated/model";
import { hasStatus } from "@app/lib/errors";
import { refreshSession } from "@app/lib/session";
import { useCallback, useEffect, useRef, useState } from "react";

type Payment = Pick<PaymentStatusResponse, "finalPrice" | "issuedCouponIds">;

type PaymentState =
  | { status: "loading" }
  | { status: "error" }
  | ({ status: "waiting" | "paid" } & Payment);

// Confirming a bank transfer takes a while; every few seconds is plenty.
const POLL_INTERVAL_MS = 3000;
// One failed check should not turn the page into an error.
const MAX_CONSECUTIVE_FAILURES = 3;

/** Resolves when the next check is due, which waits for a hidden tab to return. */
function untilNextCheck(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", finishIfVisible);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const finishIfVisible = () => {
      if (!document.hidden) finish();
    };
    const timer = setTimeout(finishIfVisible, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", finishIfVisible);
    signal.addEventListener("abort", finish);
  });
}

/** Another tab may open the payment between the check and the create. */
async function openPayment() {
  try {
    await createPayment({ issuedCouponIds: [] });
  } catch (error) {
    if (!hasStatus(error, 409)) throw error;
  }
}

/**
 * Opens this term's payment if there is none yet, then watches it until an
 * officer confirms the transfer. One loop owns every request, so checks never
 * overlap; `refresh` drops the one in progress and starts over, because it may
 * have read the payment before the change it is called for.
 */
export function usePaymentPolling() {
  const [state, setState] = useState<PaymentState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const currentCheck = useRef<AbortController | null>(null);

  const refresh = useCallback(() => currentCheck.current?.abort(), []);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a retry bumps `attempt` to start over
  useEffect(() => {
    let stopped = false;

    const run = async () => {
      let failures = 0;
      while (!stopped) {
        const check = new AbortController();
        currentCheck.current = check;
        const { signal } = check;
        try {
          const payment = await getPaymentStatus({ signal });
          if (payment.status === PaymentCheckStatus.NOT_CREATED) {
            await openPayment();
            continue;
          }
          failures = 0;
          if (payment.status === PaymentCheckStatus.COMPLETED) {
            setState({ ...payment, status: "paid" });
            // The header and member-only pages should see the new status.
            void refreshSession().catch(() => {});
            return;
          }
          setState({ ...payment, status: "waiting" });
          await untilNextCheck(signal);
        } catch (error) {
          if (signal.aborted) continue;
          failures += 1;
          if (failures >= MAX_CONSECUTIVE_FAILURES) {
            console.error(error);
            setState({ status: "error" });
            return;
          }
          await untilNextCheck(signal);
        }
      }
    };
    void run();

    return () => {
      stopped = true;
      currentCheck.current?.abort();
    };
  }, [attempt]);

  return { payment: state, refresh, retry };
}
