import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const target = process.argv[2];
if (!target) throw new Error("Pass the verification script path to with-server.mjs");

const nextBin = path.resolve("node_modules/next/dist/bin/next");
const serverMode = process.env.E2E_USE_DEV_SERVER === "true" ? "dev" : "start";
const server = spawn(process.execPath, [nextBin, serverMode, "-p", "4173"], {
  stdio: "inherit",
  env: process.env,
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:4173");
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Next server did not become ready on port 4173");
}

function stopServer() {
  if (server.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
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
