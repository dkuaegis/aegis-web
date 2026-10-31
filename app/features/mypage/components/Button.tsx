import "../style/Button.css";
import type { ButtonProps } from "../model/Button";

const Button: React.FC<ButtonProps> = ({
  text,
  type,
  onClick,
  className,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`Button Button_${type}${className ? ` ${className}` : ""}`}
    >
      {text}
      {type === "POINT" && <span className="point-arrow">{">"}</span>}
    </button>
  );
};

export default Button;
