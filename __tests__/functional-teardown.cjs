const { teardown: teardownDevServer } = require('jest-dev-server');
const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');
const globalConfig = require('../jest-puppeteer.config.cjs');

module.exports = async function globalTeardown() {
  await teardownDevServer();
  await teardownPuppeteer(globalConfig);
};