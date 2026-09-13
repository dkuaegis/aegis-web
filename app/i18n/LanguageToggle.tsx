import { useI18n } from "./I18nProvider";
import "./language-toggle.css";
import { LANGUAGE_LABELS, LANGUAGE_NAMES, LANGUAGES } from "./types";

interface LanguageToggleProps {
  /**
   * `default` suits headers with room to spare; `compact` trims the padding
   * for dense bars and mobile menus.
   */
  size?: "default" | "compact";
  className?: string;
}

/**
 * Segmented KO | EN control. The selected half is filled, so the current
 * language is readable at a glance instead of having to infer it from which
 * label is offered.
 */
export function LanguageToggle({
  size = "default",
  className,
}: LanguageToggleProps) {
  const { language, setLanguage, t } = useI18n();
  const activeIndex = LANGUAGES.indexOf(language);

  return (
    <div
      className={[
        "language-toggle",
        size === "compact" ? "is-compact" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label={t("common.languageToggleLabel")}
    >
      <span
        className="language-toggle-thumb"
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={[
            "language-toggle-option",
            language === code ? "is-active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
        >
          <span aria-hidden="true">{LANGUAGE_LABELS[code]}</span>
          <span className="language-toggle-sr">{LANGUAGE_NAMES[code]}</span>
        </button>
      ))}
    </div>
  );
}
