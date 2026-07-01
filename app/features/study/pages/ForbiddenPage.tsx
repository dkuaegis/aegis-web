import meditateData from "@study/assets/Meditate girl.json";
import Header from "@study/components/ui/Header";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

interface ForbiddenPageProps {
  message?: string;
  onBack?: (() => void) | undefined;
}

const ForbiddenPage = ({
  message = "권한이 없습니다.",
  onBack,
}: ForbiddenPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: meditateData,
    });
    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header onBack={onBack} />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8">
            <div ref={containerRef} style={{ width: 300, height: 300 }} />
          </div>
          <p className="font-medium text-gray-600 text-xl">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
