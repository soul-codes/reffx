const path = require("path");
module.exports = {
  rootDir: __dirname,
  globals: {
    "ts-jest": {
      tsConfig: path.resolve(__dirname, "src/test", "tsconfig.json"),
    },
  },
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/test/**/*.test.ts"],
  moduleNameMapper: {
    "^@lib": "<rootDir>/src/lib",
  },
};
