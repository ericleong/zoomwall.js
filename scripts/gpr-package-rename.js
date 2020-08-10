// Renames package name for Github Package Registry
// https://stackoverflow.com/questions/58347746/automating-the-build-and-publish-process-with-github-actions-and-github-package
// based off of https://github.com/EndBug/uptime-monitor/blob/v4.0.3/scripts/gpr.js

import { writeFileSync } from "fs";
import { join } from "path";

import pkg from "../package.json";

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
pkg.name = `@ericleong/${pkg.name}`;

writeFileSync(join(__dirname, "../package.json"), JSON.stringify(pkg));
