import { ApiError } from "@app/lib/api";
import {
  makePayment,
  pollPaymentStatus,
} from "@join/pages/Payment/Payment.Api";
import { useCallback, useEffect, useRef, useState } from "react";

type PaymentStatus = "loading" | "polling" | "success" | "error";

// 입금 확인에는 시간이 걸리므로 몇 초 간격이면 충분합니다.
const POLL_INTERVAL_MS = 3000;
// 일시적인 실패 한 번으로 결제 화면을 오류로 바꾸지 않습니다.
const MAX_CONSECUTIVE_FAILURES = 3;

export const usePaymentPolling = () => {
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [finalPrice, setFinalPrice] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const inFlightRef = useRef(false);

  const refreshFinalPrice = useCallback(async () => {
    // 진행 중인 조회가 곧 최신 가격을 반영하므로 겹쳐서 요청하지 않습니다.
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const result = await pollPaymentStatus();
      setFinalPrice(result.finalPrice);
    } catch (err) {
      console.error("가격 정보 업데이트에 실패했습니다:", err);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((current) => current + 1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 재시도하면 attempt가 바뀌어 결제 확인을 처음부터 다시 시작합니다.
  useEffect(() => {
    let active = true;
    let polling = false;
    let failures = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (active) timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    const stopPolling = (nextStatus: PaymentStatus) => {
      polling = false;
      setStatus(nextStatus);
    };

    const poll = async () => {
      timer = null;
      // 탭이 보이지 않으면 멈추고, 다시 보일 때 이어서 확인합니다.
      if (document.hidden) return;
      if (inFlightRef.current) {
        schedule();
        return;
      }

      inFlightRef.current = true;
      try {
        const result = await pollPaymentStatus();
        if (!active) return;
        failures = 0;
        setFinalPrice(result.finalPrice);
        if (result.status === "COMPLETED") {
          stopPolling("success");
          return;
        }
        schedule();
      } catch (err) {
        if (!active) return;
        failures += 1;
        if (failures >= MAX_CONSECUTIVE_FAILURES) {
          console.error("결제 상태를 확인하지 못했습니다:", err);
          stopPolling("error");
          return;
        }
        schedule();
      } finally {
        inFlightRef.current = false;
      }
    };

    const startPolling = () => {
      if (!active) return;
      polling = true;
      setStatus("polling");
      void poll();
    };

    const resumeWhenVisible = () => {
      if (!document.hidden && polling && timer === null) void poll();
    };
    document.addEventListener("visibilitychange", resumeWhenVisible);

    // 결제 생성 및 폴링 시작 로직
    const initializePayment = async () => {
      try {
        const paymentStatus = await pollPaymentStatus();
        if (!active) return;
        setFinalPrice(paymentStatus.finalPrice);

        if (paymentStatus.status === "COMPLETED") {
          setStatus("success");
          return;
        }

        if (paymentStatus.status === "PENDING") {
          startPolling();
          return;
        }

        await makePayment([]);
        startPolling();
      } catch (error) {
        if (!active) return;
        // 409 에러는 상태 조회 이후 동시 요청으로 이미 결제가 생성된 경우이므로 정상적으로 폴링을 시작합니다.
        if (error instanceof ApiError && error.status === 409) {
          startPolling();
        } else {
          console.error("결제 생성에 실패했습니다:", error);
          setStatus("error");
        }
      }
    };

    void initializePayment();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, [attempt]);

  const isValid = status === "success";

  return { isValid, finalPrice, status, refreshFinalPrice, retry };
};
