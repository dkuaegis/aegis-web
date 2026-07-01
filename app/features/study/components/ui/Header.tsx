import { ArrowLeft, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/mypage", label: "MYPAGE" },
] as const;

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-gray-200 border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                뒤로가기
              </Button>
            )}
            <span
              className="font-bold text-2xl text-gray-900"
              style={{
                fontFamily: '"Stack Sans Notch", sans-serif',
              }}
            >
              AEGIS
            </span>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 py-2 font-medium text-gray-700 text-sm uppercase tracking-wide transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:text-blue-600 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <span className="block h-0.5 w-6 rounded-sm bg-gray-900 transition-all duration-300"></span>
            <span className="block h-0.5 w-6 rounded-sm bg-gray-900 transition-all duration-300"></span>
            <span className="block h-0.5 w-6 rounded-sm bg-gray-900 transition-all duration-300"></span>
          </button>
        </div>
      </header>

      <div
        className={`fixed top-0 right-0 left-0 z-[100] flex flex-col bg-white px-6 py-6 shadow-lg transition-all duration-300 md:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-full opacity-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span
            className="font-bold text-2xl text-gray-900"
            style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
          >
            AEGIS
          </span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => setMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X className="h-6 w-6 text-gray-900" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-0">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-6 py-4 text-center font-medium text-gray-900 text-lg uppercase tracking-wide transition-colors hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`fixed inset-0 z-[99] bg-black/60 transition-opacity duration-300 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-label="메뉴 닫기"
      />
    </>
  );
};

export default React.memo(Header);
