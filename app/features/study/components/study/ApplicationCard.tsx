import { useI18n } from "@app/i18n";
import { fetchApplicationText } from "@study/api/applicationOwnerApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@study/components/ui/dialog";
import { useToast } from "@study/components/ui/useToast";
import {
  type Application,
  ApplicationStatus,
  StudyRecruitmentMethod,
} from "@study/types/study";
import { Check, X } from "lucide-react";
import { useState } from "react";

type ApplicationCardProps = {
  application: Application;
  onStatusChange: (
    id: number,
    status: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED
  ) => void;
  recruitmentMethod: StudyRecruitmentMethod;
  studyId: number;
};

const ApplicationCard = ({
  application,
  onStatusChange,
  recruitmentMethod,
  studyId,
}: ApplicationCardProps) => {
  const { t, language } = useI18n();
  const [applicationReason, setApplicationReason] = useState<string>("");
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const toast = useToast();

  const handleLoadApplicationText = async () => {
    if (applicationReason) return; // 이미 로드된 경우 재요청하지 않음

    try {
      setIsLoadingText(true);
      setTextError(null);
      const response = await fetchApplicationText(studyId, application.id);
      setApplicationReason(response.applicationReason);
    } catch (err: unknown) {
      console.error("Failed to load application text:", err);
      const message =
        err instanceof Error
          ? err.message
          : t("study.applications.card.loadFailed");
      setTextError(message);
      toast({ description: message });
    } finally {
      setIsLoadingText(false);
    }
  };
  const statusText =
    application.status === ApplicationStatus.PENDING
      ? t("study.applications.card.statusPending")
      : application.status === ApplicationStatus.APPROVED
        ? t("study.applications.card.statusApproved")
        : application.status === ApplicationStatus.REJECTED
          ? t("study.applications.card.statusRejected")
          : t("study.applications.card.statusUnknown");
  return (
    <tr>
      <td>
        <strong>{application.name}</strong>
      </td>
      <td>{application.studentNumber}</td>
      <td>{application.phone}</td>
      <td>
        {application.createdAt
          ? new Date(application.createdAt).toLocaleDateString(
              language === "en" ? "en-US" : "ko-KR"
            )
          : "—"}
      </td>
      <td>
        <span
          className={`status-chip status-${application.status.toLowerCase()}`}
        >
          {statusText}
        </span>
      </td>
      <td>
        {recruitmentMethod === StudyRecruitmentMethod.APPLICATION && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="button button-small button-outline"
                type="button"
                onClick={handleLoadApplicationText}
              >
                {t("study.applications.card.viewApplication")}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("study.applications.card.dialogTitle", {
                    name: application.name,
                  })}
                </DialogTitle>
                <DialogDescription>
                  {application.studentNumber} · {application.phone}
                </DialogDescription>
              </DialogHeader>
              {isLoadingText ? (
                <p role="status">{t("study.loading.application")}</p>
              ) : textError ? (
                <div>
                  <p role="alert">{textError}</p>
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={handleLoadApplicationText}
                  >
                    {t("common.retry")}
                  </button>
                </div>
              ) : (
                <div className="application-reason">{applicationReason}</div>
              )}
              {application.status === ApplicationStatus.PENDING && (
                <div className="form-actions">
                  <button
                    className="button button-danger"
                    type="button"
                    onClick={() =>
                      onStatusChange(application.id, ApplicationStatus.REJECTED)
                    }
                  >
                    <X aria-hidden="true" />{" "}
                    {t("study.applications.card.reject")}
                  </button>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() =>
                      onStatusChange(application.id, ApplicationStatus.APPROVED)
                    }
                  >
                    <Check aria-hidden="true" />{" "}
                    {t("study.applications.card.approve")}
                  </button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </td>
    </tr>
  );
};
export default ApplicationCard;
