import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { iosWebAppDirectory, webAppFiles } from "./webapp-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDirectory = path.join(root, iosWebAppDirectory);
const errors = [];

for (const file of webAppFiles) {
  const source = await readFile(path.join(root, file));
  const target = await readFile(path.join(targetDirectory, file)).catch(() => null);
  if (!target) {
    errors.push(`Missing iOS WebApp file: ${file}`);
    continue;
  }
  if (!source.equals(target)) {
    errors.push(`Out-of-sync iOS WebApp file: ${file}`);
  }
}

const appleDoubleFiles = await findAppleDoubleFiles(path.join(root, "ios"));
errors.push(...appleDoubleFiles.map((file) => `AppleDouble metadata file should not be committed: ${path.relative(root, file)}`));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`iOS WebApp bundle is synced (${webAppFiles.length} files).`);

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
