import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { iosWebAppDirectory, webAppFiles } from "./webapp-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDirectory = path.join(root, iosWebAppDirectory);

await rm(targetDirectory, { recursive: true, force: true });
await mkdir(targetDirectory, { recursive: true });

for (const file of webAppFiles) {
  await cp(path.join(root, file), path.join(targetDirectory, file));
}

await removeAppleDoubleFiles(path.join(root, "ios"));
console.log(`Synced ${webAppFiles.length} WebApp files to ${iosWebAppDirectory}`);

async function removeAppleDoubleFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.name.startsWith("._")) {
        await rm(entryPath, { recursive: true, force: true });
        return;
      }
      if (entry.isDirectory()) await removeAppleDoubleFiles(entryPath);
    })
  );
}
