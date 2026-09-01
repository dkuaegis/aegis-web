import { JOIN_STEP_KOREAN_MAP } from "@join/constants/joinSteps";
import useFunnel from "@join/hooks/useFunnel";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../button";

interface TitleProps {
  currentStep: string;
}

const Title = ({ currentStep }: TitleProps) => {
  const { prev } = useFunnel();
  const stepKeys = Object.keys(JOIN_STEP_KOREAN_MAP);
  const isFirstStep = currentStep === stepKeys[0];
  const isLastStep = currentStep === stepKeys[stepKeys.length - 1];

  return (
    <header className="join-heading">
      {!isFirstStep && !isLastStep && (
        <Button variant="icon" aria-label="Go back" onClick={prev}>
          <ArrowLeftIcon size={28} />
        </Button>
      )}
      <h1>{JOIN_STEP_KOREAN_MAP[currentStep]}</h1>
    </header>
  );
};

export default Title;
