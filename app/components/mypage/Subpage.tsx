import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { useI18n } from "@app/i18n";
import { Balance } from "./Balance";
import { useMe } from "./useMe";

/** Header and body of a page reached from the my page hub. */
export function Subpage({
  title,
  balance = false,
  children,
}: {
  title: string;
  /** On where the balance is what the page is about. */
  balance?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const me = useMe();
  return (
    <>
      <PageHeader
        className="border-b-0"
        back={{ to: "/mypage", label: t("mypage.metaTitle") }}
        title={title}
        actions={balance && <Balance amount={me.pointBalance} />}
        compact
      />
      <PageBody className="pt-0">{children}</PageBody>
    </>
  );
}
