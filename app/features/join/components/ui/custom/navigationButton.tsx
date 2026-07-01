import { Button } from "@join/components/ui/button";
import { cn } from "@join/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // 로딩 아이콘

// 기능 개선을 위해 Props 인터페이스 확장
interface NavigationButtonsProps {
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isVisible?: boolean; // 애니메이션 제어를 위한 prop
  isVisuallyDisabled?: boolean;
}

// 애니메이션 효과 정의
const variants = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: "0%", opacity: 1 },
  exit: { y: "100%", opacity: 0 },
};

export default function NavigationButtons({
  onClick,
  text = "다음",
  disabled = false,
  isLoading = false,
  isVisible = true,
  isVisuallyDisabled = false,
}: NavigationButtonsProps) {
  // AnimatePresence: isVisible 값이 바뀔 때 exit 애니메이션을 실행
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed right-0 bottom-0 left-0 flex justify-center bg-background/80 p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm"
        >
          <div className="w-full max-w-md px-4">
            <Button
              type="submit"
              onClick={onClick}
              disabled={isLoading || disabled}
              className={cn("w-full", isVisuallyDisabled && "opacity-50")}
              size="lg"
            >
              {/* isLoading 상태일 때 로딩 아이콘 표시 */}
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : text}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
