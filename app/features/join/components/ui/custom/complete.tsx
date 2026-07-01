import Success from "@join/assets/lottie/Success.json";
import Lottie from "lottie-react";

interface CompleteProps {
  message: string;
}

const Complete = ({ message }: CompleteProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Lottie
        animationData={Success}
        loop={false} // 한 번만 재생
        style={{ width: 300, height: 300 }} // 원하는 크기로 조절
      />
      <h2 className="font-semibold text-2xl tracking-tight">{message}</h2>
    </div>
  );
};

export default Complete;
