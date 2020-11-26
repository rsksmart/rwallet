module.exports = {
  // Load setup-tests.js before test execution
  setupFilesAfterEnv: ['./setup-tests.js'],
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [],
  testTimeout: 20000,
};
