module.exports = {
  verbose: true,
  watchPathIgnorePatterns: [],
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './mongo-environment.js',
  collectCoverageFrom: ['tests/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 10,
      branches: 10,
      lines: 10,
      functions: 10
    }
  }
}
