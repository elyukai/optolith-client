// @ts-check
/**
 * @typedef {import('ts-jest')}
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json"
    }
  }
}
