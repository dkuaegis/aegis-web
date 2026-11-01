import { JOIN_STEPS, joinPath } from "@app/components/join/join";
import { loadSession } from "@app/lib/session";
import { redirect } from "react-router";

/**
 * `/join` and any address below it that is not a step: members see that
 * they are done, everyone else starts at the first step.
 */
export async function clientLoader() {
  const status = await loadSession();
  throw redirect(
    status === "member" ? "/join/complete" : joinPath(JOIN_STEPS[0])
  );
}

export default function JoinStart() {
  return null;
}
