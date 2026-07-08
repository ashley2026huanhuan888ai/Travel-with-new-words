import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const jsFiles = ["app.js", "storage.js", "ocr.js", "ai.js", "service-worker.js"];
const serverFiles = [
  "server/ai-explain-service.mjs",
  "server/static-api-server.mjs",
  "api/health.js",
  "api/ai/config.js",
  "api/ai/explain.js",
  "api/ai/runtime-key.js",
  "scripts/dev-server.mjs",
  "scripts/check-api.mjs",
];
const appleDoubleRoots = [".github", "api", "docs", "scripts", "server"];

for (const file of [...jsFiles, ...serverFiles]) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

const manifest = JSON.parse(await readFile("manifest.webmanifest", "utf8"));
if (!manifest.name || !manifest.start_url) {
  throw new Error("manifest.webmanifest must include name and start_url.");
}

const indexHtml = await readFile("index.html", "utf8");
for (const required of ["app.js?v=15", "styles.css?v=15"]) {
  if (!indexHtml.includes(required)) {
    throw new Error(`index.html does not reference ${required}.`);
  }
}

const appleDoubleFiles = (await Promise.all(appleDoubleRoots.map((directory) => findAppleDoubleFiles(directory)))).flat();
if (appleDoubleFiles.length) {
  throw new Error(`AppleDouble metadata files should not be committed:\n${appleDoubleFiles.join("\n")}`);
}

console.log(`Web static checks passed (${jsFiles.length} JavaScript files).`);

async function findAppleDoubleFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const matches = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.name.startsWith("._")) {
      matches.push(entryPath);
    } else if (entry.isDirectory()) {
      matches.push(...(await findAppleDoubleFiles(entryPath)));
    }
  }
  return matches;
}
