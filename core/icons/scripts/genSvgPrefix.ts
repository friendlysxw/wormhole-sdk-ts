// Usage: npm run genSvgPrefix

import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgDir = join(__dirname, "../src/images/chains");
const prefix = "wormhole_sdk_icons";

fs.readdirSync(svgDir).forEach((file) => {
  const filePath = path.join(svgDir, file);
  const extname = path.extname(file);
  const fileName = path.basename(file).replace(extname, "");

  if (extname === ".svg") {
    let content = fs.readFileSync(filePath, "utf8");

    if (!content.includes("id=")) {
      return;
    }

    if (!content.includes("xmlns")) {
      content = content.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
    }

    const p = prefix + "_" + fileName;
    if (!content.includes(p)) {
      content = content.replace(/id="([\w-]+)"/g, `id="${p}_$1"`);
      content = content.replace(/url\(#([\w-]+)\)/g, `url(#${p}_$1)`);
      content = content.replace(/xlink:href="#([\w-]+)"/g, `xlink:href="#${p}_$1"`);
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Processed: ${fileName}`);
    } else {
      console.log(`Skipped: ${fileName}`);
    }
  }
});
