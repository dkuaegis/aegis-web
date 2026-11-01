import { createPayment, getPaymentStatus } from "@app/api/generated/endpoints";
import { PaymentCheckStatus } from "@app/api/generated/model";
import { hasStatus } from "@app/lib/errors";
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "loading" | "waiting" | "paid" | "error";

// Confirming a bank transfer takes a while; every few seconds is plenty.
const POLL_INTERVAL_MS = 3000;
// One failed check should not turn the page into an error.
const MAX_CONSECUTIVE_FAILURES = 3;

/**
 * Opens this term's payment if there is none yet, then watches it until an
 * officer confirms the transfer. Pauses while the tab is hidden.
 */
export function usePaymentPolling() {
  const [status, setStatus] = useState<Status>("loading");
  const [finalPrice, setFinalPrice] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);

  /** Reads the price again, e.g. after coupons changed it. */
  const refreshFinalPrice = useCallback(async () => {
    // A check already on its way will bring the latest price.
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      setFinalPrice((await getPaymentStatus()).finalPrice);
    } catch (error) {
      console.error(error);
    } finally {
      inFlight.current = false;
    }
  }, []);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((current) => current + 1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a retry bumps `attempt` to start over
  useEffect(() => {
    let active = true;
    let polling = false;
    let failures = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (active) timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    const stop = (next: Status) => {
      polling = false;
      setStatus(next);
    };

    const poll = async () => {
      timer = null;
      if (document.hidden) return;
      if (inFlight.current) {
        schedule();
        return;
      }
      inFlight.current = true;
      try {
        const result = await getPaymentStatus();
        if (!active) return;
        failures = 0;
        setFinalPrice(result.finalPrice);
        if (result.status === PaymentCheckStatus.COMPLETED) {
          stop("paid");
          return;
        }
        schedule();
      } catch (error) {
        if (!active) return;
        failures += 1;
        if (failures >= MAX_CONSECUTIVE_FAILURES) {
          console.error(error);
          stop("error");
          return;
        }
        schedule();
      } finally {
        inFlight.current = false;
      }
    };

    const startPolling = () => {
      if (!active) return;
      polling = true;
      setStatus("waiting");
      void poll();
    };

    const resumeWhenVisible = () => {
      if (!document.hidden && polling && timer === null) void poll();
    };
    document.addEventListener("visibilitychange", resumeWhenVisible);

    const start = async () => {
      try {
        const current = await getPaymentStatus();
        if (!active) return;
        setFinalPrice(current.finalPrice);
        if (current.status === PaymentCheckStatus.COMPLETED) {
          setStatus("paid");
          return;
        }
        if (current.status === PaymentCheckStatus.NOT_CREATED) {
          await createPayment({ issuedCouponIds: [] });
        }
        startPolling();
      } catch (error) {
        if (!active) return;
        // Another tab opened the payment between the check and the create.
        if (hasStatus(error, 409)) {
          startPolling();
        } else {
          console.error(error);
          setStatus("error");
        }
      }
    };
    void start();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, [attempt]);

  return { status, finalPrice, refreshFinalPrice, retry };
}
