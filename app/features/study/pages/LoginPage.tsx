import { useI18n } from "@app/i18n";
import { googleLoginUrl } from "@app/lib/api";
import { Button } from "@study/components/ui/button";
import { Card, CardContent } from "@study/components/ui/card";
import { gsap } from "gsap";
import type { LucideIcon } from "lucide-react";
import { BrainCircuit, CodeXml, Gamepad2, Globe, Lock } from "lucide-react";
import { useEffect, useRef } from "react";

interface IconConfig {
  id: string;
  Icon: LucideIcon;
}

const ICONS: IconConfig[] = [
  { id: "lock", Icon: Lock },
  { id: "globe", Icon: Globe },
  { id: "codeXml", Icon: CodeXml },
  { id: "gamepad", Icon: Gamepad2 },
  { id: "braincircuit", Icon: BrainCircuit },
];

const ANIMATION_CONFIG = {
  CARD_DURATION: 0.5,
  TITLE_DURATION: 0.6,
  TEXT_DURATION: 0.5,
  ICON_DURATION: 0.5,
  ICON_STAGGER: 0.1,
} as const;

const INITIAL_STATE = {
  HIDDEN_ELEMENT: { opacity: 0, y: 20 },
  HIDDEN_ICON: { opacity: 0, x: -50, scale: 0.9 },
  CARD_INITIAL: { scale: 0.95, opacity: 1 },
} as const;

const LoginPage = () => {
  const { t, tList } = useI18n();
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(
      [titleRef.current, subtitleRef.current, buttonRef.current],
      INITIAL_STATE.HIDDEN_ELEMENT
    );
    gsap.set(iconsRef.current, INITIAL_STATE.HIDDEN_ICON);
    gsap.set(cardRef.current, INITIAL_STATE.CARD_INITIAL);

    tl.to(cardRef.current, {
      scale: 1,
      duration: ANIMATION_CONFIG.CARD_DURATION,
      ease: "power2.out",
    })
      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.TITLE_DURATION,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.TEXT_DURATION,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.TEXT_DURATION,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        iconsRef.current,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: ANIMATION_CONFIG.ICON_DURATION,
          stagger: ANIMATION_CONFIG.ICON_STAGGER,
          ease: "back.out(1.4)",
        },
        "<"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <Card
        ref={cardRef}
        className="w-full max-w-md border border-gray-200/50 bg-white/90 shadow-2xl shadow-gray-500/10 backdrop-blur-sm"
      >
        <CardContent className="p-8">
          <div className="space-y-8 text-center">
            <div className="space-y-3">
              <h2
                ref={titleRef}
                className="font-bold text-3xl text-gray-900 opacity-0"
              >
                {t("study.login.title")}
              </h2>
              <p
                ref={subtitleRef}
                className="text-gray-600 leading-relaxed opacity-0"
              >
                {tList("study.login.subtitle").map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex justify-center gap-4">
              {ICONS.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    iconsRef.current[index] = el;
                  }}
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-gray-200/50 bg-white opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-gray-300 hover:shadow-lg"
                >
                  <item.Icon className="h-7 w-7 text-gray-900" />
                </div>
              ))}
            </div>

            <Button
              ref={buttonRef}
              className="h-12 w-full py-0 text-xl opacity-0"
              asChild
            >
              <a href={googleLoginUrl}>{t("study.login.button")}</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
