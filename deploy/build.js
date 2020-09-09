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

const appName = channel === "prerelease" ? "Optolith Prerelease" : "Optolith"

const buildWindows = async () => {
  console.log (`Building ${appName} for Windows...`)
  await builder.build ({ config, targets: builder.Platform.WINDOWS.createTarget () })
  console.log (`${appName} Build for Windows successful.`)
}

const buildLinux = async () => {
  console.log (`Building ${appName} for Linux...`)
  await builder.build ({ config, targets: builder.Platform.LINUX.createTarget () })
  console.log (`${appName} Build for Linux successful.`)
}

const buildMac = async () => {
  console.log (`Building ${appName} for OSX...`)
  await builder.build ({ config, targets: builder.Platform.MAC.createTarget () })
  console.log (`${appName} Build for OSX successful.`)
}

const os = getSystem()

switch (os) {
  case "linux":
    buildLinux()
    break;
  case "mac":
    buildMac()
    break;
  case "win":
    buildWindows()
    break;
}
