// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const tsPreset = require("ts-jest/jest-preset");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const puppeteerPreset = require("jest-puppeteer/jest-preset");

module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "jest-environment-jsdom-sixteen",
      coverageProvider: "v8",
      coverageReporters: ["json"],
      testMatch: ["<rootDir>/src/__tests__/unit.test.ts"],
    },
    {
      displayName: "functional",
      ...tsPreset,
      ...puppeteerPreset,
      coverageProvider: "v8",
      coverageReporters: ["json"],
      testMatch: ["<rootDir>/src/__tests__/functional.test.ts"],
    },
  ],
};
