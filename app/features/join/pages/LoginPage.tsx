import { createApiUrl } from "@app/lib/apiBaseUrl";
import { Button } from "@join/components/ui/button";
import { Analytics } from "@join/service/analytics";
import { ExternalLinkIcon } from "lucide-react";

const GOOGLE_LOGIN_URL = createApiUrl("oauth2/authorization/google");
const AEGIS_HOMEPAGE_URL = "/";
const GMAIL_GUIDE_URL = "https://sites.google.com/dankook.ac.kr/help";

const LoginPage = () => {
  return (
    <div className="join-login-page line-breaks flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="join-login-card w-full max-w-[400px] space-y-6 p-4">
        <div className="flex flex-col space-y-2 text-center">
          <img
            src="/join/aegis-logo.webp"
            alt="Aegis Logo"
            className="mx-auto mb-4 h-32 w-32"
          />
          <h1 className="font-semibold text-2xl tracking-tight">
            Aegis 회원 가입
          </h1>
          <p className="text-muted-foreground text-sm">
            단국대학교 구글 계정으로 로그인해주세요
          </p>
        </div>
        <Button
          onClick={() => {
            Analytics.safeTrack("Google_Login_Click", {
              category: "Auth",
              method: "Google",
            });
          }}
          className="w-full"
          asChild
        >
          <a href={GOOGLE_LOGIN_URL}>Google로 로그인</a>
        </Button>
        <Button
          onClick={() => {
            Analytics.safeTrack("Go_Homepage_Click", {
              category: "Auth",
              method: "Homepage",
            });
          }}
          className="w-full"
          asChild
        >
          <a
            href={AEGIS_HOMEPAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Aegis 홈페이지
          </a>
        </Button>
      </div>
      <div className="flex flex-col text-center">
        <a
          href={GMAIL_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 font-extrabold text-muted-foreground text-sm underline"
          onClick={() => {
            Analytics.safeTrack("Gmail_Guide_Click", {
              category: "Link",
              method: "Guide",
            });
          }}
        >
          단국대 Gmail 생성 가이드
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
