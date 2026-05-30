"use client";

import { useEffect, useState } from "react";

const TOKEN_TTL_MS = 5 * 60 * 1000;       // 5 minutes (matches KV TTL)
const REFRESH_INTERVAL_MS = 3 * 60 * 1000; // refresh 2 min before expiry

let cachedPromise: Promise<string> | null = null;

function fetchToken(): Promise<string> {
  cachedPromise = fetch("/api/download-token")
    .then((res) => res.json())
    .then((data) => data.token as string);
  return cachedPromise;
}

function getOrFetchToken(): Promise<string> {
  if (!cachedPromise) {
    return fetchToken();
  }
  return cachedPromise;
}

export function useDownloadToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getOrFetchToken().then(setToken);

    const interval = setInterval(() => {
      fetchToken().then(setToken);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return token;
}
