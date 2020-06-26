// Renames package name for Github Package Registry
// https://stackoverflow.com/questions/58347746/automating-the-build-and-publish-process-with-github-actions-and-github-package
// based off of https://github.com/EndBug/uptime-monitor/blob/v4.0.3/scripts/gpr.js

const fs = require("fs")
const { join } = require("path")

const pkg = require("../package.json")

pkg.name = `@ericleong/${pkg.name}`

fs.writeFileSync(join(__dirname, "../package.json"), JSON.stringify(pkg))