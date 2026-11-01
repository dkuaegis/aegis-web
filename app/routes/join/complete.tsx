import { ChatRooms } from "@app/components/join/ChatRooms";
import { JOIN_STEPS, joinPath } from "@app/components/join/join";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { useI18n } from "@app/i18n";
import { loadSession } from "@app/lib/session";
import { redirect } from "react-router";

/** Only members get here; anyone else still has steps left. */
export async function clientLoader() {
  if ((await loadSession()) !== "member") {
    throw redirect(joinPath(JOIN_STEPS[0]));
  }
  return null;
}

export default function JoinComplete() {
  const { t } = useI18n();

  return (
    <div className="narrow-frame [--frame-width:42rem]">
      <PageHeader
        className="border-b-0"
        title={t("join.complete.title")}
        description={
          <>
            {t("join.complete.noticeLead")}
            <strong className="font-[750] text-ink">
              {t("join.complete.noticeStrong")}
            </strong>
            {t("join.complete.noticeTail")}
          </>
        }
      />
      <PageBody className="pt-0">
        <ChatRooms />
      </PageBody>
    </div>
  );
}
