import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }));
  return nested.flat();
}

const staticRoot = path.resolve(".next", "static");
const files = await filesUnder(staticRoot);
const forbidden = /AXS_ADMIN_API_ORIGIN|AXS_CLIENT_PROXY_SECRET|NEXT_PUBLIC_API_ORIGIN|ops\.armourxsports\.com/i;
for (const file of files) {
  if (!/\.(?:js|json|map)$/.test(file)) continue;
  if (forbidden.test(await readFile(file, "utf8"))) {
    throw new Error(`Server-only Operations configuration reached a browser bundle: ${file}`);
  }
}
process.stdout.write(`PASS browser bundle server-only configuration scan (${files.length} static files).\n`);
