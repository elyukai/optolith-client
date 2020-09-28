// @ts-check
const builder = require("electron-builder")
const { getSystem } = require("./platform")

const [channel] = process.argv.slice(2)

if (channel !== "stable" && channel !== "prerelease") {
  throw new TypeError (`publishToServer requires a specified channel ("stable" or "prerelease"), but it received ${channel}`)
}

const config =
  channel === "prerelease"
  ? require("./build.prerelease.config.js")
  : require("./build.config.js")

process.on ('unhandledRejection', error => {
  throw new Error (`Unhandled promise rejection: ${error .toString ()}`);
});

const os = getSystem()

const plaformKey = os === "linux" ? "LINUX" : os === "mac" ? "MAC" : "WINDOWS"

builder.build ({ config, targets: builder.Platform[plaformKey].createTarget () })
