import { useI18n } from "@app/i18n";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@join/components/ui/collapsible";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { ScrollArea } from "@join/components/ui/scroll-area";
import { type ConsentState, chapters } from "@join/constants/regulation";
import useFunnel from "@join/hooks/useFunnel";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import AgreementConsent from "./Agreement.Consent";

const Agreement = () => {
  const { t, tList, language } = useI18n();
  const [openChapters, setOpenChapters] = useState<string[]>([]);
  const [consent, setConsent] = useState<ConsentState>({
    regulations: false,
    privacy: false,
  });
  const { next } = useFunnel();

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleConsentChange = (key: keyof ConsentState, checked: boolean) => {
    setConsent((prev) => ({ ...prev, [key]: checked }));
  };

  const allConsentsGiven = Object.values(consent).every(Boolean);

  /**
   * An article is either a single paragraph or a list of clauses. `tList`
   * returns one entry for the former and many for the latter, so the shape of
   * the copy decides the markup.
   */
  const renderArticleContent = (paragraphs: string[]) => {
    if (paragraphs.length > 1) {
      return (
        <ul className="ml-4 space-y-2">
          {paragraphs.map((item) => (
            <li key={item} className="flex items-start space-x-2">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
              <span className="text-gray-700 text-sm leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p className="text-gray-700 text-sm leading-relaxed">{paragraphs[0]}</p>
    );
  };

  return (
    <div className="flex h-100 flex-col">
      {/* The Korean text is the binding version, so every other language gets
          told so before it is asked to agree. */}
      {language !== "ko" && (
        <p className="join-agreement-notice">
          {t("join.regulation.translationNotice")}
        </p>
      )}

      <ScrollArea className="h-100 flex-1">
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="rounded-lg border bg-white">
              <Collapsible
                open={openChapters.includes(chapter.id)}
                onOpenChange={() => toggleChapter(chapter.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-base text-gray-900">
                        {t(`join.regulation.chapters.${chapter.id}.title`)}
                      </span>
                    </div>
                    {openChapters.includes(chapter.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-gray-100 border-t px-4 pb-4">
                    <div className="mt-4 space-y-4">
                      {chapter.articles.map((number) => {
                        const base = `join.regulation.chapters.${chapter.id}.articles.${number}`;
                        return (
                          <div key={number} className="space-y-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {t("join.regulation.articleLabel", {
                                number,
                                title: t(`${base}.title`),
                              })}
                            </h4>
                            {renderArticleContent(tList(`${base}.content`))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AgreementConsent
        consent={consent}
        onConsentChange={handleConsentChange}
      />

      <NavigationButtons
        text={t("join.actions.agreeAndContinue")}
        disabled={!allConsentsGiven}
        onClick={next}
      />
    </div>
  );
};

export default Agreement;
