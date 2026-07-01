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
  const { isApplying, handleApply } = useApplicationState();
  return (
    <>
      <div className="flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isApplying || !recruiting}
              className="group relative w-full max-w-xl overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
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
                {isApplying ? "처리 중..." : "지원하기"}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[calc(100vw-12rem)] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>스터디 신청 확인</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 신청하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="group relative min-w-[120px] overflow-hidden bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </span>
                <span className="relative z-10">취소</span>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApply}
                disabled={isApplying}
                className="group relative min-w-[120px] overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700"
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
                  {isApplying ? "처리 중..." : "신청"}
                </span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-center text-gray-500 text-xs">
        {recruiting
          ? "선착순으로 모집되며, 정원이 마감되면 자동으로 마감됩니다."
          : "모집이 마감되었습니다."}
      </p>
    </>
  );
};

export default FirstComeForm;
