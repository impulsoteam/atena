module.exports = {
  verbose: true,
  watchPathIgnorePatterns: [
    'calculateReactions',
    'reactions',
    // "interaction",
    'userLevelHistory',
    'user',
    'disqus',
    'achievementLevel',
    'ranking',
    'achievements',
    'calculateReceivedScore',
    'github'
  ],
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './mongo-environment.js',
  collectCoverageFrom: [
    'controllers/*.js',
    'cron/*.js',
    'helpers/*.js',
    'models/*.js',
    'rocket/*.js',
    'utils/*.js',
    'workers/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 10,
      branches: 10,
      lines: 10,
      functions: 10
    }
  }
}
