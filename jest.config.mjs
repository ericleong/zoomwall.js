export default {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'jest-environment-jsdom-sixteen',
      coverageProvider: 'v8',
      testMatch: ['<rootDir>/__tests__/unit.test.js']
    },
    {
      displayName: 'functional',
      preset: 'jest-puppeteer',
      coverageProvider: 'v8',
      testMatch: ['<rootDir>/__tests__/functional.test.js'],
      globalSetup: '<rootDir>/__tests__/functional-setup.cjs',
      globalTeardown: '<rootDir>/__tests__/functional-teardown.cjs'
    }
  ]
};