import C from "../public/C.svg";
import CPP from "../public/CPP.svg";
import CSHARP from "../public/CSHARP.svg";
import DART from "../public/DART.svg";
import GOLANG from "../public/GOLANG.svg";
import JAVA from "../public/JAVA.svg";
import JS from "../public/JS.svg";
import KOTLIN from "../public/KOTLIN.svg";
import NONE from "../public/NONE.svg";
import PHP from "../public/PHP.svg";
import PYTHON from "../public/PYTHON.svg";
import RUBY from "../public/RUBY.svg";
import RUST from "../public/RUST.svg";
import SWIFT from "../public/SWIFT.svg";

export const PROFILE_ICONS: Record<string, string> = {
  C,
  CPP,
  CSHARP,
  DART,
  GOLANG,
  JS,
  JAVA,
  KOTLIN,
  PHP,
  PYTHON,
  RUBY,
  RUST,
  SWIFT,
  NONE,
};

export type IconKey = keyof typeof PROFILE_ICONS;

export const ICON_KEYS: IconKey[] = Object.keys(PROFILE_ICONS) as IconKey[];
