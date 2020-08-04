const { setup: setupDevServer } = require('jest-dev-server');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const globalConfig = require('../jest-puppeteer.config.cjs');

module.exports = async function globalSetup() {
  await setupDevServer(globalConfig.server);
  await setupPuppeteer(globalConfig);
};