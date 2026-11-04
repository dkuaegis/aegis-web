import type { clientLoader } from "@app/routes/study/layout";
import { useRouteLoaderData } from "react-router";

/** The visitor's roles and the sign-up policy, loaded by the study layout. */
export function useStudyContext() {
  const data = useRouteLoaderData<typeof clientLoader>("routes/study/layout");
  if (!data) throw new Error("useStudyContext must be used below /study");
  return data;
}
