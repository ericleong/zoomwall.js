import fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const report = JSON.parse(fs.readFileSync("./.nyc_output/out.json").toString());

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
for (const key of Object.keys(report)) {
  if (key.endsWith("zoomwall.ts")) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const jsObj = report[key];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const jsPath = path.parse(jsObj.path);
    jsPath.dir = jsPath.dir.replace(`${path.sep}.nyc_output${path.sep}js`, "");

    const newPath = path.format(jsPath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jsObj.path = newPath;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete report[key];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    report[newPath] = jsObj;
  }
}

fs.writeFileSync("./.nyc_output/out.json", JSON.stringify(report));
