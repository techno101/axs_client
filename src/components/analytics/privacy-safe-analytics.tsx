"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { analyticsAllowedOnPath, privacySafeAnalyticsEvent } from "@/lib/analytics-privacy";

export function PrivacySafeAnalytics() {
  const pathname = usePathname();
  if (process.env.NEXT_PUBLIC_ANALYTICS_DISABLED === "true") return null;
  if (!analyticsAllowedOnPath(pathname)) return null;
  return <Analytics beforeSend={privacySafeAnalyticsEvent} />;
}
