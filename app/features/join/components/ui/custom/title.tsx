import { Stack } from "@join/components/layout/Stack";
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

  if (isFirstStep || isLastStep) {
    return (
      <div className="flex h-9 items-center justify-center">
        <h1 className="font-bold text-2xl">
          {JOIN_STEP_KOREAN_MAP[currentStep]}
        </h1>
      </div>
    );
  } else {
    return (
      <Stack>
        <Button variant="icon" aria-label="Go back" onClick={prev}>
          <ArrowLeftIcon size={28} />
        </Button>
        <h1 className="font-bold text-2xl">
          {JOIN_STEP_KOREAN_MAP[currentStep]}
        </h1>
      </Stack>
    );
  }
};

export default Title;
