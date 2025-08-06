import fs from "fs";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const { version } = packageJson;

const versionData = {
  version: version,
  buildDate: new Date().toISOString(),
};

const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(
  path.join(publicDir, "version.json"),
  JSON.stringify(versionData, null, 2)
);

console.log(`Version ${version} written to public/version.json`);
