// @ts-check
/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec)|_(test|spec)\\.bs)\\.jsx?$",
  moduleFileExtensions: [
    "js",
    "jsx",
    "json",
    "node"
  ],
  testEnvironment: "node"
}
