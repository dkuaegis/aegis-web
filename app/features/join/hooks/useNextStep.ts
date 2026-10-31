import { t } from "@app/i18n/store";
import { useState } from "react";
import toast from "react-hot-toast";
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
      toast.error(t("join.actions.submitFailed"));
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSubmit };
};
