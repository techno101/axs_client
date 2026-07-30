export type ClientProxyConfig = {
  adminOrigin: string;
  clientOrigin: string;
  proxySecret: string;
};

type EnvironmentSource = Record<string, string | undefined>;

function required(source: EnvironmentSource, key: string): string {
  const value = source[key]?.trim();
  if (!value) throw new Error(`${key} must be configured in the server secret store.`);
  return value;
}

function exactOrigin(value: string, key: string, production: boolean): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${key} must be a valid origin.`);
  }
  const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  const allowedProtocol = parsed.protocol === "https:" || (!production && local && parsed.protocol === "http:");
  if (!allowedProtocol || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(`${key} must use HTTPS, except for localhost or 127.0.0.1 HTTP outside production.`);
  }
  return parsed.origin;
}

export function readClientProxyConfig(source: EnvironmentSource): ClientProxyConfig {
  const production = source.NODE_ENV === "production" || Boolean(source.VERCEL);
  const proxySecret = required(source, "AXS_CLIENT_PROXY_SECRET");
  if (proxySecret.length < 32 || proxySecret.length > 512) {
    throw new Error("AXS_CLIENT_PROXY_SECRET must be 32-512 characters.");
  }
  return {
    adminOrigin: exactOrigin(required(source, "AXS_ADMIN_API_ORIGIN"), "AXS_ADMIN_API_ORIGIN", production),
    clientOrigin: exactOrigin(required(source, "PUBLIC_APP_ORIGIN"), "PUBLIC_APP_ORIGIN", production),
    proxySecret,
  };
}

export function loadClientProxyConfig(): ClientProxyConfig {
  return readClientProxyConfig(process.env);
}
