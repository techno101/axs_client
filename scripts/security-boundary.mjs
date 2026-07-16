import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }));
  return children.flat();
}

const files = (await filesUnder(path.resolve("src"))).filter((file) => /\.(ts|tsx)$/.test(file));
for (const file of files) {
  const content = await readFile(file, "utf8");
  if (/dangerouslySetInnerHTML|\beval\(|new Function\(/.test(content)) throw new Error(`Unsafe executable content sink found in ${file}.`);
  // The pinned contract may name an admin-owned payment method. It remains
  // data-only; executable payment, database and webhook code is forbidden.
  if (!file.includes(`${path.sep}api${path.sep}contract${path.sep}`) && /\bpg\b|DATABASE_URL|webhook/i.test(content)) throw new Error(`Public client boundary violation found in ${file}.`);
  if (/NEXT_PUBLIC_(?:.*SECRET|.*DATABASE|.*TOKEN|.*PASSWORD|.*KEY)/i.test(content)) throw new Error(`Sensitive public environment reference found in ${file}.`);
}
process.stdout.write(`PASS public-client boundary scan (${files.length} source files).\n`);
