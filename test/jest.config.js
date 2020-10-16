module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "node_modules",
    "test",
    "src/migrations",
    "src/config/TypeORM.ts",
    "src/index.ts",
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  verbose: false,
  rootDir: "../",
  setupFiles: ["core-js"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!<rootDir>/node_modules/"
  ],
  setupFilesAfterEnv: ["./test/jestConfig/setup.ts"],
  watchPathIgnorePatterns: ["./node_modules/"],
  testPathIgnorePatterns: [".d.ts", ".js"]
};
