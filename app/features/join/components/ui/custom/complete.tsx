import Success from "@join/assets/lottie/Success.json";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

interface CompleteProps {
  message: string;
}

const Complete = ({ message }: CompleteProps) => {
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lottieContainerRef.current) return;

    const animation = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: Success,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div
        ref={lottieContainerRef}
        style={{ width: 300, height: 300 }}
        aria-hidden="true"
      />
      <h2 className="font-semibold text-2xl tracking-tight">{message}</h2>
    </div>
  );
};

export default Complete;
