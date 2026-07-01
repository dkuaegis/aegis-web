import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@study/components/ui/alert-dialog";
import { Button } from "@study/components/ui/button";
import { Textarea } from "@study/components/ui/textarea";
import { useApplicationState } from "./ApplicationStateContext";

interface Iprops {
  recruiting: boolean;
}

const ApplicationForm = ({ recruiting }: Iprops) => {
  const {
    isApplying,
    isApplicationModalOpen,
    applicationText,
    setIsApplicationModalOpen,
    handleApply,
    setApplicationText,
  } = useApplicationState();

  return (
    <>
      <p className="mb-2 text-center text-gray-500 text-xs">
        지원 동기 및 각오를 작성해주세요
      </p>
      <Button
        onClick={() => setIsApplicationModalOpen(true)}
        disabled={isApplying || !recruiting}
        aria-busy={isApplying}
        className="group relative w-full max-w-xl overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex h-56 w-56 scale-0 transform items-center justify-center rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
        ></span>
        <span className="relative z-10">
          {isApplying ? "처리 중..." : "지원서 작성하기"}
        </span>
      </Button>

      <AlertDialog
        open={isApplicationModalOpen && recruiting}
        onOpenChange={setIsApplicationModalOpen}
      >
        <AlertDialogContent className="max-h-[80vh] max-w-[calc(100vw-12rem)] sm:max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>지원서 작성</AlertDialogTitle>
            <AlertDialogDescription>
              지원 동기 및 각오를 작성해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            id="application"
            placeholder="스터디에 지원하는 이유와 목표, 각오 등을 자유롭게 작성해주세요."
            value={applicationText}
            onChange={(e) => setApplicationText(e.target.value)}
            className="mt-2 max-h-[min(300px,60vh)] min-h-[120px] resize-y overflow-y-auto border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:min-h-[200px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsApplicationModalOpen(false)}>
              닫기
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                void handleApply();
              }}
              disabled={!applicationText.trim() || isApplying}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isApplying ? "처리 중..." : "제출"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApplicationForm;
