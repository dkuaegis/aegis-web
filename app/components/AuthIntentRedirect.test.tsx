import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkAuth } from "../api/auth";
import { storeLoginIntent } from "../lib/authIntent";
import { AuthIntentRedirect } from "./AuthIntentRedirect";

vi.mock("../api/auth", () => ({
  checkAuth: vi.fn(),
}));

function CurrentPath() {
  const location = useLocation();
  return <output data-testid="current-path">{location.pathname}</output>;
}

function renderRedirect() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthIntentRedirect />
      <CurrentPath />
      <Routes>
        <Route path="/" element={<span>Home</span>} />
        <Route path="/join" element={<span>Join</span>} />
        <Route path="/study/*" element={<span>Study</span>} />
        <Route path="/mypage/qr" element={<span>QR</span>} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(cleanup);

beforeEach(() => {
  window.sessionStorage.clear();
  vi.mocked(checkAuth).mockReset();
});

describe("AuthIntentRedirect", () => {
  it("routes completed study intents to the saved safe destination", async () => {
    storeLoginIntent("study", "/study/algorithms?week=2");
    vi.mocked(checkAuth).mockResolvedValue({
      isAuthenticated: true,
      status: "COMPLETED",
    });

    renderRedirect();

    expect(await screen.findByText("Study")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe(
      "/study/algorithms"
    );
    expect(window.sessionStorage.getItem("aegis.login-intent")).toBeNull();
  });

  it("routes pending study intents to the join flow", async () => {
    storeLoginIntent("study", "/study/algorithms");
    vi.mocked(checkAuth).mockResolvedValue({
      isAuthenticated: true,
      status: "PENDING",
    });

    renderRedirect();

    expect(await screen.findByText("Join")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe("/join");
  });

  it("does not redirect completed join intents", async () => {
    storeLoginIntent("join");
    vi.mocked(checkAuth).mockResolvedValue({
      isAuthenticated: true,
      status: "COMPLETED",
    });

    renderRedirect();

    expect(await screen.findByText("Home")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe("/");
  });
});
