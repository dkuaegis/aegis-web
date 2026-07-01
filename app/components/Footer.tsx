function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">AEGIS</div>
        <div className="footer-right">
          <div className="footer-links">
            <a
              className="footer-link instagram-link"
              href="https://instagram.com/dku_aegis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="instagram dku_aegis"
            >
              <svg
                className="instagram-icon"
                viewBox="0 0 28 28"
                fill="none"
                aria-label="INSTAGRAM"
              >
                <path
                  fill="#fff"
                  d="M9.333 3.5A5.834 5.834 0 0 0 3.5 9.333v9.334A5.834 5.834 0 0 0 9.333 24.5h9.334a5.834 5.834 0 0 0 5.833-5.833V9.333A5.834 5.834 0 0 0 18.667 3.5zM21 5.833a1.167 1.167 0 1 1 0 2.335 1.167 1.167 0 0 1 0-2.335m-7 2.334a5.834 5.834 0 1 1-.001 11.667A5.834 5.834 0 0 1 14 8.167m0 2.333a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7"
                ></path>
              </svg>
            </a>
            <a
              className="footer-link github-link"
              href="https://github.com/dkuaegis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="github dku_aegis"
            >
              <svg
                className="github-icon"
                viewBox="0 0 28 28"
                fill="none"
                aria-label="GITHUB"
              >
                <path
                  fill="currentColor"
                  d="M12.717 2.45C7.35 3.033 3.034 7.35 2.45 12.6c-.583 5.483 2.567 10.383 7.35 12.25.35.117.7-.117.7-.583V22.4s-.466.117-1.05.117c-1.633 0-2.333-1.4-2.45-2.217-.116-.467-.35-.817-.7-1.167-.35-.116-.466-.116-.466-.233 0-.233.35-.233.466-.233.7 0 1.284.816 1.517 1.166C8.4 20.767 9.1 21 9.45 21c.467 0 .817-.117 1.05-.233.117-.817.467-1.634 1.167-2.1C8.984 18.083 7 16.567 7 14c0-1.283.584-2.567 1.4-3.5-.116-.233-.233-.817-.233-1.633 0-.467 0-1.05.233-1.517 0-.233.234-.35.35-.35h.117c.583.117 1.75.467 2.8 1.517.7-.234 1.517-.35 2.333-.35s1.634.116 2.334.35c1.05-1.05 2.333-1.4 2.916-1.517h.117c.233 0 .35.117.467.35v1.517c0 .933-.117 1.4-.234 1.633.817.933 1.4 2.1 1.4 3.5 0 2.567-1.983 4.083-4.666 4.667.7.583 1.166 1.633 1.166 2.683v3.033c0 .35.35.7.817.584 4.317-1.75 7.35-5.95 7.35-10.85 0-7-5.95-12.484-12.95-11.667"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-meta">
        <span>© 2026 aegis all rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
