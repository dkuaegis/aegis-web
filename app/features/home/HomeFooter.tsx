import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

export function HomeFooter() {
  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", "#top");
  };

  return (
    <footer className="home-site-footer" id="footer">
      <div className="home-site-footer-brand">
        <Link to="#top" onClick={scrollToTop}>
          AEGIS
        </Link>
        <address>단국대학교 죽전캠퍼스 혜당관 530호</address>
      </div>
      <nav aria-label="소셜 및 문의 링크">
        <a href="mailto:dankook.aegis@gmail.com">Email ↗</a>
        <a href="https://github.com/dkuaegis" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a
          href="https://instagram.com/dku_aegis"
          target="_blank"
          rel="noreferrer"
        >
          Instagram ↗
        </a>
      </nav>
    </footer>
  );
}
