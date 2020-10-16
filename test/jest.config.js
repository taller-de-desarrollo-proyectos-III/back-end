module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["node_modules", "test", "src/migrations", "src/config/TypeORM.ts"],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  verbose: true,
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
