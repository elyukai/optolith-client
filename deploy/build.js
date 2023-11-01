// @ts-check
import builder from "electron-builder"
import { getSystem } from "./platform.js"

const args = process.argv.slice(2)

if (!args.includes("--stable") && !args.includes("--prerelease")) {
  throw new TypeError(`build requires a specified channel ("--stable" or "--prerelease")`)
}

const config = args.includes("--prerelease")
  ? (await import("./build.prerelease.config.js")).prereleaseConfig
  : (await import("./build.stable.config.js")).stableConfig

process.on("unhandledRejection", error => {
  throw new Error(`Unhandled promise rejection: ${/** @type {Error} */ (error).toString()}`)
})

const os = getSystem()

const plaformKey = os === "linux" ? "LINUX" : os === "mac" ? "MAC" : "WINDOWS"

await builder.build({
  config,
  targets: builder.Platform[plaformKey].createTarget(),
})
