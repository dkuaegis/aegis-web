import { Period, Wordmark } from "@app/components/site/Wordmark";
import { Button } from "@app/components/ui/button";
import { useI18n } from "@app/i18n";
import { copyToClipboard } from "@app/lib/clipboard";
import {
  type InAppBrowser,
  isIOS,
  openInDefaultBrowser,
} from "@app/lib/in-app-browser";
import { CopyIcon } from "lucide-react";
import { useEffect } from "react";

/** In-app browsers we can give exact, app-specific instructions for. */
const GUIDED_BROWSERS = [
  "kakaotalk",
  "instagram",
  "naver",
  "facebook",
  "line",
] as const;

export function BrowserRedirectPage({ browser }: { browser: InAppBrowser }) {
  const { t, tList } = useI18n();

  useEffect(() => {
    openInDefaultBrowser(browser);
  }, [browser]);

  const guided = GUIDED_BROWSERS.find((key) => key === browser);
  const steps = tList(`pages.browserRedirect.steps.${guided ?? "fallback"}`);
  const safariHint =
    guided === "kakaotalk"
      ? t("pages.browserRedirect.safariHint.kakaotalk")
      : null;
  const browserName = t(`pages.browserRedirect.names.${browser}`);

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="flex min-h-(--header-height) items-center bg-ink px-4 text-paper">
        <Wordmark />
      </header>
      <main className="gutter-x grid flex-1 content-start gap-8 pt-[clamp(2.5rem,10vw,5rem)] pb-12">
        <div className="grid gap-4">
          <h1 className="m-0 text-[clamp(1.9rem,8vw,2.6rem)] leading-[1.12] font-[820] tracking-[-0.05em]">
            {t("pages.browserRedirect.title", { browser: browserName })}
            <Period />
          </h1>
          <p className="m-0 text-[1rem] leading-relaxed font-[560] text-ink-muted">
            {isIOS()
              ? t("pages.browserRedirect.iosHint")
              : t("pages.browserRedirect.genericHint")}
          </p>
        </div>

        <ol className="m-0 grid list-none border-t border-ink p-0">
          {steps.map((step, index) => (
            <li
              key={step}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-5"
            >
              <span className="eyebrow tabular text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[1.0625rem] leading-snug font-[720]">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <Button
          variant="ink"
          className="w-full"
          onClick={() => void copyToClipboard(window.location.href)}
        >
          <CopyIcon aria-hidden="true" />
          {t("pages.browserRedirect.copyLink")}
        </Button>

        {safariHint && (
          <p className="m-0 text-[0.875rem] text-ink-muted">{safariHint}</p>
        )}

        <p className="m-0 text-[0.8125rem] text-ink-subtle">
          {t("pages.browserRedirect.support")}
        </p>
      </main>
    </div>
  );
}
