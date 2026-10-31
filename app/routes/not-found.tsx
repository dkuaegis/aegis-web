import { NotFoundState } from "@app/components/page/States";
import { t } from "@app/i18n/store";

export function meta() {
  return [{ title: t("common.states.notFoundTitle") }];
}

export default function NotFound() {
  return <NotFoundState />;
}
