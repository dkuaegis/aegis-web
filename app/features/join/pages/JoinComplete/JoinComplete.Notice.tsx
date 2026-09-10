import { useI18n } from "@app/i18n";

const CompleteNotice = () => {
  const { t } = useI18n();

  return (
    <div className="join-complete-notice break-words">
      <p className="line-breaks">
        {t("join.complete.noticeLead")}
        <strong>{t("join.complete.noticeStrong")}</strong>
        {t("join.complete.noticeTail")}
      </p>
    </div>
  );
};

export default CompleteNotice;
