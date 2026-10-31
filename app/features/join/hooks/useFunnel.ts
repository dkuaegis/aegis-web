import { JOIN_STEPS } from "@join/constants/joinSteps";
import { useLocation, useNavigate } from "react-router";

const steps = JOIN_STEPS;
const JOIN_BASE_PATH = "/join";

const useFunnel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = location.pathname.replace(/^\/join\/?/, "");
  const currentIndex = steps.indexOf(currentStep);

  const progress =
    currentIndex > -1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  const next = () => {
    const nextStepIndex = currentIndex + 1;
    if (nextStepIndex < steps.length) {
      navigate(`${JOIN_BASE_PATH}/${steps[nextStepIndex]}`);
    }
  };

  const prev = () => {
    const prevStepIndex = currentIndex - 1;
    if (prevStepIndex >= 0) {
      navigate(`${JOIN_BASE_PATH}/${steps[prevStepIndex]}`);
    }
  };

  const goto = (step: string) => {
    if (steps.includes(step)) {
      navigate(`${JOIN_BASE_PATH}/${step}`);
    }
  };

  return {
    steps,
    currentStep,
    currentIndex,
    progress,
    next,
    prev,
    goto,
  };
};

export default useFunnel;
