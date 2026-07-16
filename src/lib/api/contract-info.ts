import { API_CONTRACT_SHA256, API_CONTRACT_VERSION, API_TIMEZONE } from "@/lib/api/contract/v1";

/** Public client metadata for the pinned v1 API representation. No network call occurs here. */
export const pinnedPublicContract = {
  version: API_CONTRACT_VERSION,
  checksum: API_CONTRACT_SHA256,
  timezone: API_TIMEZONE,
} as const;
