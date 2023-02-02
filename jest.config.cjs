// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const tsPreset = require("ts-jest/jest-preset");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const puppeteerPreset = require("jest-puppeteer/jest-preset");

module.exports = {
  coverageReporters: ["json"],
  coverageDirectory: ".nyc_output",
  coverageProvider: "v8",
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/src/__tests__/unit.test.ts"],
    },
    {
      displayName: "functional",
      ...tsPreset,
      ...puppeteerPreset,
      testMatch: ["<rootDir>/src/__tests__/functional.test.ts"],
    },
  ],
};
