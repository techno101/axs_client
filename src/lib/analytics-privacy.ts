import type { BeforeSendEvent } from "@vercel/analytics";

const blockedPaths = ["/booking/result", "/booking/find"];

export function privacySafeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  let url: URL;
  try {
    url = new URL(event.url, "https://analytics.invalid");
  } catch {
    return null;
  }
  if (blockedPaths.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`))) return null;
  const sanitizedUrl = url.origin === "https://analytics.invalid" ? url.pathname : `${url.origin}${url.pathname}`;
  return { ...event, url: sanitizedUrl };
}

export function analyticsAllowedOnPath(pathname: string): boolean {
  return !blockedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
