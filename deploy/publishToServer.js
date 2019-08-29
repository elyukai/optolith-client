// @ts-check

require("dotenv").config()
const ftp = require ("basic-ftp")
const Client = require ("ssh2-sftp-client")
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

    const subFolder = os === "win" ? "win" : os === "linux" ? "linux" : "mac"

    const updateYmlName =
      os === "win"
      ? "latest.yml"
      : os === "linux"
      ? "latest-linux.yml"
      : "latest-mac.yml"

    const distPath = channel === "insider" ? ["dist", "insider"] : ["dist"]

    const serverPath = `./update.optolith.app/${channel === "insider" ? "insider/" : ""}${subFolder}`

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

    console.log(`Files to upload: ${[updateYmlName, ...latestFileNames] .join (", ")}`);

    // Actual server connection

    const client = new Client ()

    console.log("Connecting to server...");

    await client.connect ({
      host: process.env.HOST,
      port: 22,
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    })

    console.log(`Server connection established`);

    console.log(`Uploading ${updateYmlName}`);

    const updateYml = fs.readFileSync (path.join (...distPath, updateYmlName))
    const ymlRes = await client.put (updateYml, `${serverPath}/${updateYmlName}`)

    console.log(`Upload done: ${updateYmlName} (${ymlRes})`);

    for (const fileName of latestFileNames) {
      console.log(`Uploading ${fileName}`);

      const stream = fs.readFileSync (path.join (...distPath, fileName))
      const fileRes = await client.put (stream, `${serverPath}/${fileName}`)

      console.log(`Upload done: ${fileName} (${fileRes})`);
    }

    await client.end ()

    console.log("Closed server connection.");
  }

module.exports = {
  publishToServer
}
