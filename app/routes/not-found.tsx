import { NotFoundState } from "@app/components/page/States";
import { t } from "@app/i18n/store";
import { pageTitle } from "@app/lib/title";

export function meta() {
  return [{ title: pageTitle(t("common.states.notFoundTitle")) }];
}

export default function NotFound() {
  return <NotFoundState />;
}
