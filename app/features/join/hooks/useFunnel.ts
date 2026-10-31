import { JOIN_STEPS } from "@join/constants/joinSteps";
import { useLocation, useNavigate } from "react-router";

const JOIN_BASE_PATH = "/join";

const useFunnel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = location.pathname.replace(/^\/join\/?/, "");
  const currentIndex = JOIN_STEPS.indexOf(currentStep);

  const next = () => {
    const nextStepIndex = currentIndex + 1;
    if (nextStepIndex < JOIN_STEPS.length) {
      navigate(`${JOIN_BASE_PATH}/${JOIN_STEPS[nextStepIndex]}`);
    }
  };

  const prev = () => {
    const prevStepIndex = currentIndex - 1;
    if (prevStepIndex >= 0) {
      navigate(`${JOIN_BASE_PATH}/${JOIN_STEPS[prevStepIndex]}`);
    }
  };

  return {
    currentStep,
    next,
    prev,
  };
};

export default useFunnel;
