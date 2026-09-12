import { useI18n } from "@app/i18n";
import { ChevronRight } from "lucide-react";
import { useId, useState } from "react";

const AdminInfoDrawer = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <div className="join-payment-inquiry">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((current) => !current)}
      >
        {t("join.payment.inquiry.title")}
        <ChevronRight aria-hidden="true" />
      </button>
      <div
        id={detailsId}
        className="join-payment-inquiry-details"
        hidden={!open}
      >
        <strong>{import.meta.env.VITE_ADMIN_PHONE}</strong>
        {import.meta.env.VITE_ADMIN_KAKAO && (
          <span>
            {t("join.payment.inquiry.kakaoLabel")}:{" "}
            {import.meta.env.VITE_ADMIN_KAKAO}
          </span>
        )}
        <span>{t("join.payment.inquiry.hint")}</span>
      </div>
    </div>
  );
};

export default AdminInfoDrawer;
