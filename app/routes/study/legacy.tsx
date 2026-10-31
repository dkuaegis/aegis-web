import { redirect } from "react-router";
import type { Route } from "./+types/legacy";

/** `/study/detail/3` → `/study/3`, `/study/members/3` → `/study/3/members`. */
export function clientLoader({ request, params }: Route.ClientLoaderArgs) {
  const { pathname } = new URL(request.url);
  const section = pathname.split("/")[2];
  const studyId = "studyId" in params ? params.studyId : undefined;

  if (section === "create" || !studyId) throw redirect("/study/new");
  if (section === "detail") throw redirect(`/study/${studyId}`);
  throw redirect(`/study/${studyId}/${section}`);
}

export default function LegacyStudyRedirect() {
  return null;
}
