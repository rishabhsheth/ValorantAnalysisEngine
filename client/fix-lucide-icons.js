// fix-lucide-icons.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Needed to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  "node_modules/lucide-react/dist/esm/lucide-react.js",
  "node_modules/lucide-react/dist/esm/icons/index.js",
];

for (const file of files) {
  const filePath = path.resolve(__dirname, file);
  if (fs.existsSync(filePath)) {
    const contents = fs.readFileSync(filePath, "utf-8");
    const filtered = contents
      .split("\n")
      .filter((line) => !line.includes("Fingerprint"))
      .join("\n");
    fs.writeFileSync(filePath, filtered, "utf-8");
    console.log(`Removed Fingerprint from ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
}

// Also delete the actual icon file
const iconPath = path.resolve(
  __dirname,
  "node_modules/lucide-react/dist/esm/icons/fingerprint.js"
);
if (fs.existsSync(iconPath)) {
  fs.unlinkSync(iconPath);
  console.log("Deleted fingerprint.js");
}
