import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { Link } from "react-router";

export function meta() {
  return [{ title: translate("pages.notFound.title") }];
}

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <main className="auth-continue-page">
      <p role="alert">{t("pages.notFound.title")}</p>
      <Link className="auth-continue-retry" to="/">
        {t("pages.notFound.home")}
      </Link>
    </main>
  );
}
