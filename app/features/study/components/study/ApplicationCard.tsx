import { useI18n } from "@app/i18n";
import { fetchApplicationText } from "@study/api/applicationOwnerApi";
import { Avatar, AvatarFallback } from "@study/components/ui/avatar";
import { Badge } from "@study/components/ui/badge";
import { Button } from "@study/components/ui/button";
import { Card, CardContent } from "@study/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@study/components/ui/dialog";
import { Textarea } from "@study/components/ui/textarea";
import { useToast } from "@study/components/ui/useToast";
import type { Application } from "@study/types/study";
import { ApplicationStatus, StudyRecruitmentMethod } from "@study/types/study";
import { CheckCircle, Eye, FileText, XCircle } from "lucide-react";
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
  const { t } = useI18n();
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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return (
          <Badge className="status-badge-pending">
            {t("study.applications.card.statusPending")}
          </Badge>
        );
      case ApplicationStatus.APPROVED:
        return (
          <Badge className="status-badge-approved">
            {t("study.applications.card.statusApproved")}
          </Badge>
        );
      case ApplicationStatus.REJECTED:
        return (
          <Badge className="status-badge-rejected">
            {t("study.applications.card.statusRejected")}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {t("study.applications.card.statusUnknown")}
          </Badge>
        );
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="application-card">
      <CardContent className="application-card-content">
        <div className="application-header">
          <div className="application-avatar-section">
            <Avatar className="application-avatar">
              <AvatarFallback className="application-avatar-fallback">
                {getInitials(application.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="application-name">{application.name}</h3>
              <div className="application-contact-info">
                <span className="application-contact-icon">📞</span>
                {application.phone}
              </div>
              <div className="application-contact-info">
                <span className="application-contact-icon">🎓</span>
                {t("study.applications.card.studentIdLabel")}:{" "}
                {application.studentNumber}
              </div>
            </div>
          </div>
          <div className="application-status-section">
            {getStatusBadge(application.status)}
          </div>
        </div>

        <div className="application-actions">
          <div className="application-actions-left">
            {recruitmentMethod === StudyRecruitmentMethod.APPLICATION && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-view-application"
                    onClick={handleLoadApplicationText}
                  >
                    <Eye className="icon-size-sm" />
                    {t("study.applications.card.viewApplication")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="dialog-max-width">
                  <DialogHeader>
                    <DialogTitle className="dialog-header-title">
                      <FileText className="dialog-icon" />
                      {t("study.applications.card.dialogTitle", {
                        name: application.name,
                      })}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="dialog-content">
                    <div className="dialog-info-box">
                      <div className="dialog-info-row">
                        <span>
                          {t("study.applications.card.applicantLabel")}:{" "}
                          {application.name}
                        </span>
                        <span>
                          {t("study.applications.card.studentIdLabel")}:{" "}
                          {application.studentNumber}
                        </span>
                      </div>
                    </div>
                    {isLoadingText ? (
                      <div className="dialog-loading-container">
                        <div className="dialog-loading-content">
                          <div className="dialog-loading-spinner"></div>
                          <p className="dialog-loading-text">
                            {t("study.loading.application")}
                          </p>
                        </div>
                      </div>
                    ) : textError ? (
                      <div className="dialog-loading-container">
                        <div className="dialog-loading-content">
                          <p className="dialog-error-text">{textError}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLoadApplicationText}
                            className="dialog-retry-button"
                          >
                            {t("common.retry")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        value={applicationReason}
                        readOnly
                        className="dialog-textarea"
                        placeholder={t("study.applications.card.loadingPlaceholder")}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {application.status === ApplicationStatus.PENDING && (
            <div className="application-actions-right">
              <Button
                size="sm"
                onClick={() =>
                  onStatusChange(application.id, ApplicationStatus.APPROVED)
                }
                className="btn-approve"
              >
                <CheckCircle className="icon-size-xs" />
                {t("study.applications.card.approve")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onStatusChange(application.id, ApplicationStatus.REJECTED)
                }
                className="btn-reject"
              >
                <XCircle className="icon-size-xs" />
                {t("study.applications.card.reject")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
