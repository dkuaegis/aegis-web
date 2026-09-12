import { useExternalBrowser } from "@app/hooks/useExternalBrowser";
import { useI18n } from "@app/i18n";
import { useEffect, useState } from "react";

/** In-app browsers we can give exact, app-specific instructions for. */
const GUIDED_BROWSERS = [
  "kakaotalk",
  "instagram",
  "naver",
  "facebook",
  "line",
] as const;

const BrowserRedirectPage = () => {
  const { browserKey, openInDefaultBrowser } = useExternalBrowser();
  const { t, tList } = useI18n();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()));
  }, []);

  useEffect(() => {
    openInDefaultBrowser();
  }, [openInDefaultBrowser]);

  const guided = GUIDED_BROWSERS.find((key) => key === browserKey);
  const steps = tList(
    `pages.browserRedirect.steps.${guided ?? "fallback"}`
  );
  const safariHint =
    guided === "kakaotalk"
      ? t("pages.browserRedirect.safariHint.kakaotalk")
      : null;
  const browserName = t(
    `pages.browserRedirect.names.${browserKey ?? "inApp"}`
  );

  return (
    <div className="wrap-break-word mx-10 flex h-screen flex-col items-center justify-center space-y-4">
      <h1 className="font-medium text-3xl">
        {t("pages.browserRedirect.title", { browser: browserName })}
      </h1>
      <p className="text-muted-foreground text-xl">
        {isIOS
          ? t("pages.browserRedirect.iosHint")
          : t("pages.browserRedirect.genericHint")}
      </p>

      <div className="w-full max-w-sm space-y-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="font-bold text-2xl text-gray-800">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="text-left font-semibold text-base text-gray-900">
                {step}
              </p>
            </div>
          </div>
        ))}

        {safariHint && (
          <p className="text-center text-gray-500 text-xs">{safariHint}</p>
        )}
      </div>

      <p className="text-center text-gray-500 text-sm">
        {t("pages.browserRedirect.support")}
      </p>
    </div>
  );
};

export default BrowserRedirectPage;
