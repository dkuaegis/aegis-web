import { useI18n } from "@app/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@study/components/ui/alert-dialog";
import { Button } from "@study/components/ui/button";
import { useApplicationState } from "./ApplicationStateContext";

interface FirstComeFormProps {
  recruiting: boolean;
}

const FirstComeForm = ({ recruiting }: FirstComeFormProps) => {
  const { t } = useI18n();
  const { isApplying, handleApply } = useApplicationState();
  return (
    <>
      <div className="flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isApplying || !recruiting}
              className="group relative w-full max-w-xl overflow-hidden disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </span>
              <span className="relative z-10">
                {isApplying
                  ? t("study.application.form.processing")
                  : t("study.application.fcfs.applyButton")}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("study.application.fcfs.confirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("study.application.fcfs.confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="group relative min-w-[120px] overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </span>
                <span className="relative z-10">{t("common.cancel")}</span>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApply}
                disabled={isApplying}
                className="group relative min-w-[120px] overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </span>
                <span className="relative z-10">
                  {isApplying
                    ? t("study.application.form.processing")
                    : t("study.application.fcfs.confirmSubmit")}
                </span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-center text-gray-500 text-xs">
        {recruiting
          ? t("study.application.fcfs.recruitingHint")
          : t("study.application.fcfs.closedHint")}
      </p>
    </>
  );
};

export default FirstComeForm;
