import JoinApp from "@join/App";
import { Analytics } from "@join/service/analytics";
import "@join/index.css";

Analytics.init();

export default function JoinRoute() {
  return <JoinApp />;
}
