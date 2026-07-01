import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { initGoogleAnalytics } from "./utils/analytics";

// Google Analytics 초기화
initGoogleAnalytics();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
