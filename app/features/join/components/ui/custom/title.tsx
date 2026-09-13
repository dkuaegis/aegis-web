import { useI18n } from "@app/i18n";
import { JOIN_STEPS, joinStepLabelKey } from "@join/constants/joinSteps";
import useFunnel from "@join/hooks/useFunnel";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../button";

interface TitleProps {
  currentStep: string;
}

const Title = ({ currentStep }: TitleProps) => {
  const { t } = useI18n();
  const { prev } = useFunnel();
  const isFirstStep = currentStep === JOIN_STEPS[0];
  const isLastStep = currentStep === JOIN_STEPS[JOIN_STEPS.length - 1];

  return (
    <header className="join-heading">
      {!isFirstStep && !isLastStep && (
        <Button
          variant="icon"
          aria-label={t("join.actions.goBack")}
          onClick={prev}
        >
          <ArrowLeftIcon size={28} />
        </Button>
      )}
      <h1>{t(joinStepLabelKey(currentStep))}</h1>
    </header>
  );
};

export default Title;
