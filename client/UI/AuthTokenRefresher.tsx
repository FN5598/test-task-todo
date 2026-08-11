"use client";

import { useEffect, useRef } from "react";

const REFRESH_INTERVAL_MS = 14 * 60 * 1_000;

async function refreshSession() {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (response.status === 401) {
      return "unauthorized";
    }

    return response.ok ? "refreshed" : "unavailable";
  } catch {
    return "unavailable";
  }
}

export default function AuthTokenRefresher() {
  const sessionIsActive = useRef(true);

  useEffect(() => {
    async function refreshIfActive() {
      if (!sessionIsActive.current) {
        return;
      }

      const result = await refreshSession();

      if (result === "unauthorized") {
        sessionIsActive.current = false;
      }
    }

    function refreshOnFocus() {
      if (document.visibilityState === "visible") {
        void refreshIfActive();
      }
    }

    const interval = window.setInterval(
      () => void refreshIfActive(),
      REFRESH_INTERVAL_MS,
    );
    document.addEventListener("visibilitychange", refreshOnFocus);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, []);

  return null;
}
