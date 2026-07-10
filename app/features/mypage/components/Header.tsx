import { useNavigate } from "react-router-dom";
import type { HeaderProps } from "../model/Header";
import "../style/Header.css";

const Header: React.FC<HeaderProps> = ({ title, leftChild, backPath }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backPath || "/mypage");
  };

  return (
    <header className="Header">
      <button type="button" className="header_left" onClick={handleBack}>
        {leftChild}
      </button>
      <div className="header_center">{title}</div>
    </header>
  );
};

export default Header;
