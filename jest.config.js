export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/plugins/**",
    "!src/index.ts",
    "!src/admin.ts",
    "!src/adminPage.ts",
    "!**/node_modules/**"
  ],
};