// @ts-check
import { join } from "node:path"
import packageJson from "../package.json" assert { type: "json" }
import { run, upload } from "./uploader.js"

/**
 * Needed env variables:
 * - `HOST`
 * - `USERNAME`
 * - `PASSWORD`
 * - `ROOT`
 *
 * Optional env variables:
 * - `CI`
 */
const { HOST, USERNAME, PASSWORD, ROOT = "/", CI } = process.env

const args = process.argv.slice(2)

// Detect channel

if (!args.includes("--stable") && !args.includes("--prerelease")) {
  throw new TypeError(`Missing channel argument (either "--stable" or "--prerelease")`)
}

const isPrerelease = args.includes("--prerelease")

console.log(`Detected channel: ${isPrerelease ? "prerelease" : "stable"}`)

// Detect OS

let os
let osName

if (process.argv.includes("--linux") || process.platform === "linux") {
  os = /** @type {const} */ ("linux")
  osName = "Linux"
} else if (process.argv.includes("--mac") || process.platform === "darwin") {
  os = /** @type {const} */ ("mac")
  osName = "macOS"
} else if (process.argv.includes("--win") || process.platform === "win32") {
  os = /** @type {const} */ ("win")
  osName = "Windows"
} else {
  throw new TypeError(`The target operating system cannot be inferred from the environment.`)
}

console.log(`Detected operating system: ${osName}`)

// Infer files to upload

let fileExtensions
let updateInfoFileName

switch (os) {
  case "win":
    fileExtensions = [".exe", ".exe.blockmap"]
    updateInfoFileName = "latest.yml"
    break
  case "linux":
    fileExtensions = [".AppImage", ".tar.gz"]
    updateInfoFileName = "latest-linux.yml"
    break
  case "mac":
    fileExtensions = [".dmg", ".dmg.blockmap", ".zip", ".zip.blockmap"]
    updateInfoFileName = "latest-mac.yml"
    break
}

const fileNames = [
  ...fileExtensions.map(ext => {
    const chPart = isPrerelease ? "Insider" : ""
    const osPart = os === "win" ? "Setup" : ""
    return `Optolith${chPart}${osPart}_${packageJson.version}${ext}`
  }),
  updateInfoFileName,
]

console.log(`Files to upload: ${fileNames.join(", ")}.`)

// Upload files

const localDir = isPrerelease ? join("dist", "insider") : join("dist")
const remoteDir = join(ROOT, isPrerelease ? "insider" : ".", os)

await run({ host: HOST, username: USERNAME, password: PASSWORD }, async client => {
  for (const fileName of fileNames) {
    console.log(`Uploading ${fileName} ...`)
    await upload(client, localDir, remoteDir, fileName)
  }
})

console.log(`Uploading files finished successfully.`)
