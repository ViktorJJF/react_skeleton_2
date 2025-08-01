const fs = require("fs");
const path = require("path");
const { version } = require("../package.json");

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
