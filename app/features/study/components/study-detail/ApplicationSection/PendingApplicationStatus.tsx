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
import type { StudyDetail } from "@study/types/study";
import { StudyRecruitmentMethod } from "@study/types/study";
import { Edit } from "lucide-react";
import { useApplicationState } from "./ApplicationStateContext";

interface PendingApplicationStatusProps {
  study: StudyDetail;
}

const PendingApplicationStatus = ({ study }: PendingApplicationStatusProps) => {
  const {
    isApplying,
    isApplicationModalOpen,
    isLoadingApplicationDetail,
    editingApplicationText,
    setIsApplicationModalOpen,
    handleUpdateApplication,
    handleEditApplication,
    setEditingApplicationText,
  } = useApplicationState();
  return (
    <div className="space-y-4 text-center">
      <p className="text-gray-600">스터디 신청이 검토 중입니다.</p>

      {study.recruitmentMethod === StudyRecruitmentMethod.APPLICATION &&
        handleEditApplication && (
          <Button
            onClick={handleEditApplication}
            variant="outline"
            className="w-full border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
            disabled={isLoadingApplicationDetail}
          >
            <Edit className="mr-1 h-4 w-4" />
            {isLoadingApplicationDetail ? "불러오는 중..." : "지원서 수정하기"}
          </Button>
        )}

      {/* 지원서 수정 모달 */}
      {study.recruitmentMethod === StudyRecruitmentMethod.APPLICATION &&
        handleUpdateApplication && (
          <AlertDialog
            open={isApplicationModalOpen}
            onOpenChange={setIsApplicationModalOpen}
          >
            <AlertDialogContent className="max-h-[80vh] max-w-[calc(100vw-12rem)] sm:max-w-4xl">
              <AlertDialogHeader>
                <AlertDialogTitle>지원서 수정</AlertDialogTitle>
                <AlertDialogDescription>
                  기존 지원서 내용이 불러와졌습니다. 지원 동기 및 각오를
                  수정해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                id="application-edit"
                placeholder="스터디에 지원하는 이유와 목표, 각오 등을 자유롭게 작성해주세요."
                value={editingApplicationText}
                onChange={(e) => setEditingApplicationText(e.target.value)}
                className="mt-2 max-h-[min(300px,60vh)] min-h-[120px] resize-y overflow-y-auto border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:min-h-[200px]"
              />
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setIsApplicationModalOpen(false)}
                >
                  닫기
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    void handleUpdateApplication();
                  }}
                  disabled={!editingApplicationText.trim() || isApplying}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isApplying ? "수정 중..." : "수정 완료"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
    </div>
  );
};

export default PendingApplicationStatus;
