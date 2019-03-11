module.exports = {
  verbose: true,
  watchPathIgnorePatterns: [
    "calculateReactions",
    "reactions",
    "interaction",
    "userLevelHistory",
    "user",
    "disqus"
  ],
  globalSetup: "./setup.js",
  globalTeardown: "./teardown.js",
  testEnvironment: "./mongo-environment.js"
};
