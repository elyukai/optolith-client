// @ts-check

require("dotenv").config()
const ftp = require ("basic-ftp")
const fs = require ("fs")
const path = require ("path")
const semver = require ("semver");

/**
 * Needed env variables:
 * - `HOST`
 * - `USERNAME`
 * - `PASSWORD`
 *
 * Needed command line args:
 *
 * `channel os`
 *
 * `channel = stable | insider`
 *
 * `os = win | osx | linux`
 *
 * @param channel {"stable" | "insider"}
 * @param os {"win" | "osx" | "linux"}
 */
const publishToServer =
  async (channel, os) => {
    // if (channel !== "stable" && channel !== "insider") {
    //   throw new TypeError (`publishToServer requires a specified channel ("stable" or "insider"), but it received ${channel .toString ()}`)
    // }

    // if (os !== "win" && os !== "osx" && os !== "linux") {
    //   throw new TypeError (`publishToServer requires a specified OS ("win", "osx" or "linux"), but it received ${os .toString ()}`)
    // }

    const Client = new ftp.Client ()

    console.log("Connecting to server...");

    const accessRes = await Client.access ({
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false
      }
    })

    if (accessRes .code < 200 && accessRes .code >= 300) {
      throw new Error(`Server error: ${accessRes .message}`)
    }

    console.log("Server connection established");

    const subFolder = os === "win" ? "win" : os === "linux" ? "linux" : "mac"

    const updateYmlName =
      os === "win"
      ? "latest.yml"
      : os === "linux"
      ? "latest-linux.yml"
      : "latest-mac.yml"

    const distPath = channel === "insider" ? ["dist", "insider"] : ["dist"]

    const serverPath = `${channel === "insider" ? "/insider/" : "/"}${subFolder}`

    const updateYml = fs.createReadStream (path.join (...distPath, updateYmlName))

    await Client.upload (updateYml, `${serverPath}/${updateYmlName}`)

    console.log(`Upload done: ${updateYmlName}`);

    const regex =
      channel === "insider"
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
      channel === "insider"
      ? os === "win"
        ? /**
        * @param {string} v Version
        */ v => [`OptolithInsiderSetup_${v}.exe`]
        : os === "linux"
        ? /**
        * @param {string} v Version
        */ v => [`OptolithInsider_${v}.AppImage`, `OptolithInsider_${v}.tar.gz`]
        : /**
        * @param {string} v Version
        */ v => [`OptolithInsider_${v}.dmg`, `OptolithInsider_${v}.zip`]
      : os === "win"
        ? /**
        * @param {string} v Version
        */ v => [`OptolithSetup_${v}.exe`]
        : os === "linux"
        ? /**
        * @param {string} v Version
        */ v => [`Optolith_${v}.AppImage`, `Optolith_${v}.tar.gz`]
        : /**
        * @param {string} v Version
        */ v => [`Optolith_${v}.dmg`, `Optolith_${v}.zip`]

    const allFiles = await fs.promises.readdir (path.join (...distPath))

    const allInstallerNames = allFiles .filter (fileName => regex .test (fileName))

    const allInstallerVersionsSorted =
      allInstallerNames .map (fileName => regex .exec (fileName) [1])
                        .sort (semver .rcompare)

    if (allInstallerVersionsSorted .length < 1) {
      throw new RangeError ("Array of sorted installer versions is empty")
    }

    const latestFileNames = recreateFileNames (allInstallerVersionsSorted [0])

    for (const fileName of latestFileNames) {
      const stream = fs.createReadStream (path.join (...distPath, fileName))
      await Client.upload (stream, `${serverPath}/${fileName}`)
      console.log(`Upload done: ${fileName}`);
    }

    Client.close ()

    console.log("Closed server connection.");
  }

module.exports = {
  publishToServer
}
