import type { clientLoader } from "@app/routes/mypage/layout";
import { useRouteLoaderData } from "react-router";

/** The signed-in member, loaded once by the my page layout. */
export function useMe() {
  const data = useRouteLoaderData<typeof clientLoader>("routes/mypage/layout");
  if (!data) throw new Error("useMe must be used below /mypage");
  return data.me;
}
