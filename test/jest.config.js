module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["node_modules", "test"],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  watchPathIgnorePatterns: ["./node_modules/"],
  testPathIgnorePatterns: [".d.ts", ".js"]
};
