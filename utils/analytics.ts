type Platform = "windows" | "macos" | "linux";
type Component = "hero" | "cta";

interface DownloadBeaconPayload {
  platform: Platform;
  component: Component;
  sw: number;
  sh: number;
}

export function sendDownloadBeacon(platform: Platform, component: Component): void {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") {
    return;
  }

  try {
    const payload: DownloadBeaconPayload = {
      platform,
      component,
      sw: screen.width,
      sh: screen.height,
    };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon("/api/beacon", blob);
  } catch {
    // Silently fail — analytics must never block the download
  }
}

export function handleDownloadClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  platform: Platform,
  component: Component,
): void {
  const href = e.currentTarget.href;
  const isNormalClick = e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey;

  sendDownloadBeacon(platform, component);

  if (isNormalClick) {
    e.preventDefault();
    window.location.href = href;
  }
}
