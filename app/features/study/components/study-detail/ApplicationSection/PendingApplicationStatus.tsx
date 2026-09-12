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
  const { t } = useI18n();
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
      <p className="text-gray-600">
        {t("study.application.statusMessage.pending")}
      </p>

      {study.recruitmentMethod === StudyRecruitmentMethod.APPLICATION &&
        handleEditApplication && (
          <Button
            onClick={handleEditApplication}
            variant="outline"
            className="w-full border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
            disabled={isLoadingApplicationDetail}
          >
            <Edit className="mr-1 h-4 w-4" />
            {isLoadingApplicationDetail
              ? t("study.loading.applicationShort")
              : t("study.application.form.editButton")}
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
                <AlertDialogTitle>
                  {t("study.application.form.editDialogTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("study.application.form.editDialogDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                id="application-edit"
                placeholder={t("study.application.form.placeholder")}
                value={editingApplicationText}
                onChange={(e) => setEditingApplicationText(e.target.value)}
                className="mt-2 max-h-[min(300px,60vh)] min-h-[120px] resize-y overflow-y-auto border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:min-h-[200px]"
              />
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setIsApplicationModalOpen(false)}
                >
                  {t("common.close")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    void handleUpdateApplication();
                  }}
                  disabled={!editingApplicationText.trim() || isApplying}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isApplying
                    ? t("study.application.form.editSubmitting")
                    : t("study.application.form.editSubmit")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
    </div>
  );
};

export default PendingApplicationStatus;
