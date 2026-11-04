import { getMypage, issueQrCode } from "@app/api/generated/endpoints";
import { Button } from "@app/components/ui/button";
import { Skeleton } from "@app/components/ui/skeleton";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { errorMessage } from "@app/lib/errors";
import { pageTitle } from "@app/lib/title";
import { ArrowLeftIcon, RotateCwIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/qr";

/** Matches `QRCodeService.QR_CODE_VALIDITY_SECONDS` on the server. */
const VALID_SECONDS = 60;

export function meta() {
  return [{ title: pageTitle(translate("mypage.qrPage.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { me: await getMypage({ signal: request.signal }) };
}

type QrState =
  | { status: "loading" }
  | { status: "ready"; image: string; expiresAt: number }
  | { status: "error"; message: string };

/**
 * A code an organizer scans at events. Each code lives a minute, so the
 * page fetches a new one when it runs out while the screen is in view.
 */
export default function QrCheckIn({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const [state, setState] = useState<QrState>({ status: "loading" });
  const inFlight = useRef(false);

  const issue = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState((current) =>
      current.status === "ready" ? current : { status: "loading" }
    );
    try {
      const base64 = await issueQrCode();
      setState({
        status: "ready",
        image: `data:image/png;base64,${base64}`,
        expiresAt: Date.now() + VALID_SECONDS * 1000,
      });
    } catch (error) {
      setState({ status: "error", message: errorMessage(error) });
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    void issue();
    const onVisible = () => {
      if (document.visibilityState === "visible") void issue();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [issue]);

  const expiresAt = state.status === "ready" ? state.expiresAt : null;

  // While hidden the code may lapse; coming back issues a new one above.
  useEffect(() => {
    if (expiresAt === null) return;
    const timer = setTimeout(() => {
      if (document.visibilityState === "visible") void issue();
    }, expiresAt - Date.now());
    return () => clearTimeout(timer);
  }, [expiresAt, issue]);

  return (
    <div className="narrow-frame">
      <div className="gutter-x grid justify-items-center gap-8 pt-[clamp(2rem,5vw,4rem)] pb-[clamp(3rem,8vw,6rem)] text-center">
        <Link
          to="/mypage"
          className="group inline-flex items-center gap-[5px] justify-self-start text-[0.875rem] font-[700] text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeftIcon
            aria-hidden="true"
            className="-ml-[3px] size-4 transition-transform group-hover:-translate-x-0.5"
          />
          {t("mypage.qrPage.back")}
        </Link>

        <div className="grid gap-2">
          <h1 className="text-title m-0">{loaderData.me.name}</h1>
          <p className="m-0 text-[0.9375rem] text-ink-muted">
            {t("mypage.qrPage.description")}
          </p>
        </div>

        <div className="grid w-full max-w-[22rem] gap-4">
          <div className="relative aspect-square bg-white p-[8%]">
            {state.status === "ready" ? (
              <img
                src={state.image}
                alt={t("mypage.qrPage.imageAlt", { name: loaderData.me.name })}
                className="size-full [image-rendering:pixelated]"
              />
            ) : state.status === "loading" ? (
              <Skeleton className="size-full" />
            ) : (
              <div
                role="alert"
                className="grid size-full place-content-center gap-4 text-[0.9375rem] font-[650] text-danger"
              >
                {state.message}
              </div>
            )}
          </div>

          {expiresAt !== null && <Countdown expiresAt={expiresAt} />}

          <Button variant="outline" onClick={() => void issue()}>
            <RotateCwIcon aria-hidden="true" />
            {t("mypage.qrPage.refresh")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Countdown({ expiresAt }: { expiresAt: number }) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));

  return (
    <div className="grid gap-2" aria-live="off">
      <div className="h-[3px] w-full bg-line">
        <div
          className="h-full bg-ink transition-[width] duration-300 ease-linear"
          style={{ width: `${(remaining / VALID_SECONDS) * 100}%` }}
        />
      </div>
      <p className="tabular m-0 text-[0.8125rem] font-[650] text-ink-muted">
        {t("mypage.qrPage.expiresIn", { seconds: remaining })}
      </p>
    </div>
  );
}
