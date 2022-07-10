// @ts-check
import builder from "electron-builder"
import { getSystem } from "./platform.mjs"

const [channel] = process.argv.slice(2)

if (channel !== "stable" && channel !== "prerelease") {
  throw new TypeError (`publishToServer requires a specified channel ("stable" or "prerelease"), but it received ${channel}`)
}

const config =
  channel === "prerelease"
  ? (await import("./build.prerelease.config.mjs")).default
  : (await import("./build.config.mjs")).default

process.on ('unhandledRejection', error => {
  throw new Error(`Unhandled promise rejection: ${/** @type {Error} */ (error).toString ()}`)
})

const os = getSystem()

const plaformKey = os === "linux" ? "LINUX" : os === "mac" ? "MAC" : "WINDOWS"

await builder.build({
  config,
  targets: builder.Platform[plaformKey].createTarget(),
})
