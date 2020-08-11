// Renames package name for Github Package Registry
// https://stackoverflow.com/questions/58347746/automating-the-build-and-publish-process-with-github-actions-and-github-package
// based off of https://github.com/EndBug/uptime-monitor/blob/v4.0.3/scripts/gpr.js

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const path = require("path");

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = require("../package.json");

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/restrict-template-expressions
pkg.name = `@ericleong/${pkg.name}`;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-call
fs.writeFileSync(path.join(__dirname, "../package.json"), JSON.stringify(pkg));
