import { StepActions, stepButtonClassName } from "@app/components/join/Funnel";
import { joinPath } from "@app/components/join/join";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@app/components/ui/accordion";
import { Button } from "@app/components/ui/button";
import { Checkbox } from "@app/components/ui/checkbox";
import { useI18n } from "@app/i18n";
import { useId, useState } from "react";
import { useNavigate } from "react-router";

/**
 * The structure of the club rules. Chapter titles and article text are
 * translated, so they live in `join.regulation.chapters` in the locales.
 */
const CHAPTERS = [
  { id: "general", articles: [1, 2] },
  { id: "membership", articles: [3, 4, 5, 6] },
  { id: "operating", articles: [7, 8, 9, 10, 11] },
  { id: "disciplinary", articles: [12, 13] },
  { id: "accounting", articles: [14, 15] },
  { id: "privacy", articles: [16] },
] as const;

const CONSENTS = ["regulations", "privacy"] as const;

type Consent = (typeof CONSENTS)[number];

export default function Agreement() {
  const { t, tList, language } = useI18n();
  const navigate = useNavigate();
  const id = useId();
  const [agreed, setAgreed] = useState<ReadonlySet<Consent>>(new Set());

  const toggle = (consent: Consent, checked: boolean) => {
    setAgreed((current) => {
      const next = new Set(current);
      if (checked) next.add(consent);
      else next.delete(consent);
      return next;
    });
  };

  return (
    <>
      {/* The Korean text is the binding version, so every other language is
          told so before it is asked to agree. */}
      {language !== "ko" && (
        <p className="m-0 mb-6 bg-paper-sunken px-4 py-3 text-[0.875rem] leading-relaxed text-ink-muted">
          {t("join.regulation.translationNotice")}
        </p>
      )}

      <Accordion multiple>
        {CHAPTERS.map((chapter) => (
          <AccordionItem key={chapter.id}>
            <AccordionTrigger>
              {t(`join.regulation.chapters.${chapter.id}.title`)}
            </AccordionTrigger>
            <AccordionContent className="grid gap-5">
              {chapter.articles.map((number) => {
                const base = `join.regulation.chapters.${chapter.id}.articles.${number}`;
                // An article is one paragraph or a list of clauses; the
                // shape of the copy decides the markup.
                const clauses = tList(`${base}.content`);
                return (
                  <section key={number} className="grid gap-2">
                    <h3 className="m-0 text-[0.9375rem] font-[750]">
                      {t("join.regulation.articleLabel", {
                        number,
                        title: t(`${base}.title`),
                      })}
                    </h3>
                    {clauses.length > 1 ? (
                      <ol className="m-0 grid list-decimal gap-1.5 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted marker:text-ink-subtle">
                        {clauses.map((clause) => (
                          <li key={clause}>{clause}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {clauses[0]}
                      </p>
                    )}
                  </section>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 grid gap-4">
        {CONSENTS.map((consent) => (
          <label
            key={consent}
            htmlFor={`${id}-${consent}`}
            className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-snug font-[650]"
          >
            <Checkbox
              id={`${id}-${consent}`}
              checked={agreed.has(consent)}
              onCheckedChange={(checked) => toggle(consent, checked)}
              className="mt-px"
            />
            <span>
              <span className="text-blue">
                {t("join.regulation.consent.requiredTag")}
              </span>
              {t(`join.regulation.consent.${consent}`)}
            </span>
          </label>
        ))}
      </div>

      <StepActions step="agreement">
        <Button
          size="lg"
          disabled={agreed.size < CONSENTS.length}
          onClick={() => navigate(joinPath("personal-info"))}
          className={stepButtonClassName}
        >
          {t("join.actions.agreeAndContinue")}
        </Button>
      </StepActions>
    </>
  );
}
