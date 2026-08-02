import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const target = process.argv[2];
if (!target) throw new Error("Pass the verification script path to with-server.mjs");
const port = Number(process.env.E2E_PORT ?? 4173);
const baseUrl = process.env.BASE_URL ?? `http://127.0.0.1:${port}`;

const nextBin = path.resolve("node_modules/next/dist/bin/next");
const fixtureAdmin = process.env.E2E_USE_FIXTURE_ADMIN === "false"
  ? null
  : spawn(process.execPath, [path.resolve("scripts/fixture-admin.mjs")], { stdio: "inherit", env: process.env });
// Browser smoke fixtures deliberately use a loopback Admin origin. `next start`
// forces NODE_ENV=production and rejects that safe local-only test boundary before
// a route renders, so use Next's development server unless a caller explicitly
// requests a production-server smoke.
const serverMode = process.env.E2E_USE_DEV_SERVER === "false" ? "start" : "dev";
const server = spawn(process.execPath, [nextBin, serverMode, "-p", String(port)], {
  stdio: "inherit",
  env: process.env,
});

async function waitForUrl(url, label) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${label} did not become ready`);
}

async function waitForServer() {
  if (fixtureAdmin) await waitForUrl("http://127.0.0.1:3000/api/ready", "Fixture Admin");
  await waitForUrl(baseUrl, `Next server on port ${port}`);
}

function stopServer() {
  if (process.platform === "win32") {
    for (const processToStop of [server, fixtureAdmin]) {
      if (processToStop && processToStop.exitCode === null) spawnSync("taskkill", ["/pid", String(processToStop.pid), "/T", "/F"], { stdio: "ignore" });
    }
  } else {
    if (server.exitCode === null) server.kill("SIGTERM");
    if (fixtureAdmin?.exitCode === null) fixtureAdmin.kill("SIGTERM");
  }
}

try {
  await waitForServer();
  const check = spawn(process.execPath, [path.resolve(target)], { stdio: "inherit", env: process.env });
  const code = await new Promise((resolve) => check.on("exit", resolve));
  if (code !== 0) process.exitCode = typeof code === "number" ? code : 1;
} finally {
  stopServer();
}
