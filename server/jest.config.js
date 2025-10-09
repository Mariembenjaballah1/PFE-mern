module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js', '**/test/**/*.spec.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'server/routes/**/*.js',
    'server/models/**/*.js',
    'server/middleware/**/*.js',
    'server.js',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
};
