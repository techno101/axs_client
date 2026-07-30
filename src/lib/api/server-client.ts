import "server-only";
import { createHttpPublicClient } from "@/lib/api/http-client";
import { loadClientProxyConfig } from "@/server/axs-proxy/config";

export function createServerPublicClient() {
  return createHttpPublicClient(`${loadClientProxyConfig().clientOrigin}/api/axs`);
}
