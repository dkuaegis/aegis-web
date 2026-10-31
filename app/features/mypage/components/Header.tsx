import { useNavigate } from "react-router";
import type { HeaderProps } from "../model/Header";
import "../style/Header.css";

const Header: React.FC<HeaderProps> = ({ title, leftChild }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/mypage");
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
