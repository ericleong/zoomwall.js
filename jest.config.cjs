const tsPreset = require('ts-jest/jest-preset')
const puppeteerPreset = require('jest-puppeteer/jest-preset')

module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'jest-environment-jsdom-sixteen',
      coverageProvider: 'v8',
      testMatch: ['<rootDir>/**/__tests__/unit.test.js']
    },
    {
      displayName: 'functional',
      ...tsPreset,
      ...puppeteerPreset,
      coverageProvider: 'v8',
      testMatch: ['<rootDir>/**/__tests__/functional.test.js'],
    }
  ]
};