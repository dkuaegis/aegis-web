import { Analytics } from "@join/service/analytics";
import { useState } from "react";
import useFunnel from "./useFunnel";

export const useNextStep = <T>(submitFunc: (data: T) => Promise<unknown>) => {
  const { next } = useFunnel();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (data: T) => {
    setIsLoading(true);
    try {
      await submitFunc(data);
      // 트래킹: 현재 단계 제출 성공
      Analytics.safeTrack("Funnel_Submit_Success", {
        category: "Funnel",
      });
      next();
    } catch (error) {
      console.error("제출 실패", error);
      // 트래킹: 제출 실패
      Analytics.safeTrack("Funnel_Submit_Failed", {
        category: "Funnel",
        error_message:
          error instanceof Error ? error.message : String(error ?? "unknown"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSubmit };
};
