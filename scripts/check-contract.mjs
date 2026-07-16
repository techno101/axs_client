import { readFile } from "node:fs/promises";
import path from "node:path";

const artifact = path.resolve("src/lib/api/contract/v1.ts");
const content = await readFile(artifact, "utf8");
if (!content.includes("PINNED CONTRACT ARTIFACT") || !/API_CONTRACT_VERSION = "1\.0\.0"/.test(content) || !/API_CONTRACT_SHA256 = "[a-f0-9]{64}"/.test(content)) {
  throw new Error("Pinned public contract artifact is missing version or checksum metadata.");
}
if (content.includes("axs_admin/") || content.includes("from \"@/../")) {
  throw new Error("Client contract artifact must not import admin source.");
}
process.stdout.write("Pinned public v1 contract artifact is structurally valid.\n");
