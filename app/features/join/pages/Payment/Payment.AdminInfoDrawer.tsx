import { ChevronRight } from "lucide-react";
import { useId, useState } from "react";

const AdminInfoDrawer = () => {
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
        입금 관련 문의
        <ChevronRight aria-hidden="true" />
      </button>
      <div
        id={detailsId}
        className="join-payment-inquiry-details"
        hidden={!open}
      >
        <strong>{import.meta.env.VITE_ADMIN_PHONE}</strong>
        {import.meta.env.VITE_ADMIN_KAKAO && (
          <span>카카오톡: {import.meta.env.VITE_ADMIN_KAKAO}</span>
        )}
        <span>문의 시 이름과 학과를 함께 보내 주세요.</span>
      </div>
    </div>
  );
};

export default AdminInfoDrawer;
