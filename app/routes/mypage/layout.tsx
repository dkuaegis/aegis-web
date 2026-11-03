import { getMypage } from "@app/api/generated/endpoints";
import { keepDataOnSearchChange } from "@app/lib/route-data";
import { Outlet } from "react-router";
import type { Route } from "./+types/layout";

export const shouldRevalidate = keepDataOnSearchChange;

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { me: await getMypage({ signal: request.signal }) };
}

export default function MypageLayout() {
  return (
    <div className="narrow-frame [--frame-width:75rem]">
      <Outlet />
    </div>
  );
}
