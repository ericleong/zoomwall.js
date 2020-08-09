export default {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'jest-environment-jsdom-sixteen',
      coverageProvider: 'v8',
      testMatch: ['<rootDir>/src/__tests__/unit.test.js']
    },
    {
      displayName: 'functional',
      preset: 'jest-puppeteer',
      coverageProvider: 'v8',
      testMatch: ['<rootDir>/src/__tests__/functional.test.js'],
    }
  ]
};