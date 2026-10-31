import { useState } from "react";
import useFunnel from "./useFunnel";

export const useNextStep = <T>(submitFunc: (data: T) => Promise<unknown>) => {
  const { next } = useFunnel();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (data: T) => {
    setIsLoading(true);
    try {
      await submitFunc(data);
      next();
    } catch (error) {
      console.error("제출 실패", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSubmit };
};
