// @ts-check
require("dotenv").config()
const Client = require ("ssh2-sftp-client")
const readline = require ("readline")
const fs = require ("fs")
const path = require ("path")
const semver = require ("semver");
const { getSystem, getSystemName } = require("./platform");

const [channel] = process.argv.slice(2)
const os = getSystem()

if (channel !== "stable" && channel !== "prerelease") {
  throw new TypeError (`publishToServer requires a specified channel ("stable" or "prerelease"), but it received ${channel}`)
}

if (os !== "win" && os !== "mac" && os !== "linux") {
  throw new TypeError (`publishToServer requires a specified OS ("win", "mac" or "linux"), but it received ${os}`)
}

/**
 * Needed env variables:
 * - `HOST`
 * - `USERNAME`
 * - `PASSWORD`
 * - `ROOT`
 */
const uploadToServer = async () => {
  console.log (`Preparing to upload update files for "${getSystemName(os)}" on "${channel}" channel...`)

  const subFolder = os === "win" ? "win" : os === "linux" ? "linux" : "mac"

  const updateYmlName =
    os === "win"
    ? "latest.yml"
    : os === "linux"
    ? "latest-linux.yml"
    : "latest-mac.yml"

  const distPath = channel === "prerelease" ? ["dist", "insider"] : ["dist"]

  const serverPath = `${process.env.ROOT}${channel === "prerelease" ? "/insider" : ""}/${subFolder}`

  const regex =
    channel === "prerelease"
    ? os === "win"
      ? /^OptolithInsiderSetup_(.+)\.exe$/
      : os === "linux"
      ? /^OptolithInsider_(.+)\.(?:AppImage|tar\.gz)$/
      : /^OptolithInsider_(.+)\.(?:zip|dmg)$/
    : os === "win"
      ? /^OptolithSetup_(.+)\.exe$/
      : os === "linux"
      ? /^Optolith_(.+)\.(?:AppImage|tar\.gz)$/
      : /^Optolith_(.+)\.(?:zip|dmg)$/

  const recreateFileNames =
    channel === "prerelease"
    ? os === "win"
      ? /**
      * @param {string} v Version
      */ v => [`OptolithInsiderSetup_${v}.exe`, `OptolithInsiderSetup_${v}.exe.blockmap`]
      : os === "linux"
      ? /**
      * @param {string} v Version
      */ v => [`OptolithInsider_${v}.AppImage`, `OptolithInsider_${v}.tar.gz`]
      : /**
      * @param {string} v Version
      */ v => [`OptolithInsider_${v}.dmg`, `OptolithInsider_${v}.dmg.blockmap`, `OptolithInsider_${v}.zip`]
    : os === "win"
      ? /**
      * @param {string} v Version
      */ v => [`OptolithSetup_${v}.exe`, `OptolithSetup_${v}.exe.blockmap`]
      : os === "linux"
      ? /**
      * @param {string} v Version
      */ v => [`Optolith_${v}.AppImage`, `Optolith_${v}.tar.gz`]
      : /**
      * @param {string} v Version
      */ v => [`Optolith_${v}.dmg`, `Optolith_${v}.dmg.blockmap`, `Optolith_${v}.zip`]

  const allFiles = await fs.promises.readdir (path.join (...distPath))

  const allInstallerNames = allFiles .filter (fileName => regex .test (fileName))

  const allInstallerVersionsSorted =
    allInstallerNames .map (fileName => regex .exec (fileName) [1])
                      .sort (semver .rcompare)

  if (allInstallerVersionsSorted .length < 1) {
    throw new RangeError ("Array of sorted installer versions is empty")
  }

  const latestFileNames = recreateFileNames (allInstallerVersionsSorted [0])

  console.log(`Files to upload: ${[updateYmlName, ...latestFileNames] .join (", ")}.`);

  // Actual server connection

  const client = new Client ()

  console.log("Connecting to server ...");

  await client.connect ({
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  })

  console.log(`Server connection established.`);

  for (const fileName of latestFileNames) {
    console.log(`Uploading ${fileName}`);

    await client.fastPut (
      path.join (...distPath, fileName),
      `${serverPath}/${fileName}`,
      {
        step: (totalTransferred, _, total) => {
          const percent = Math.floor (totalTransferred / total * 100)
          console.log(`Progress: ${percent}%`);
        }
      }
    )

    console.log(`Upload done: ${fileName}.`);
  }

  console.log(`Uploading ${updateYmlName} ...`);

  await client.fastPut (
    path.join (...distPath, updateYmlName),
    `${serverPath}/${updateYmlName}`,
    {
      step: (totalTransferred, _, total) => {
        const percent = Math.floor (totalTransferred / total * 100) / 100
        console.log(`Progress: ${percent}%`);
      }
    }
  )

  console.log(`Upload done: ${updateYmlName}.`);

  await client.end ()

  console.log("Closed server connection.");
}

uploadToServer()
