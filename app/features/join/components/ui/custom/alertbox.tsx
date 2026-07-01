import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "../alert";

/*
icon 에는 아이콘을 전달해주면 됩니다.
*/
interface AlertBoxProps {
  icon: ReactNode;
  title: string;
  description: string[];
}

const AlertBox = ({ icon, title, description }: AlertBoxProps) => {
  return (
    <Alert>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      {description.map((desc) => (
        <AlertDescription className="line-breaks" key={desc}>
          {desc}
        </AlertDescription>
      ))}
    </Alert>
  );
};

export default AlertBox;
