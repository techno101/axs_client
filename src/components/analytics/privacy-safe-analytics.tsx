"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { analyticsAllowedOnPath, privacySafeAnalyticsEvent } from "@/lib/analytics-privacy";

export function PrivacySafeAnalytics() {
  const pathname = usePathname();
  if (!analyticsAllowedOnPath(pathname)) return null;
  return <Analytics beforeSend={privacySafeAnalyticsEvent} />;
}
