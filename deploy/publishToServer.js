// @ts-check

require("dotenv").config()
// const Client = require ("ssh2-sftp-client")
const { Client } = require ("qusly-core")
const os = require ("os")
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
    if (channel !== "stable" && channel !== "insider") {
      throw new TypeError (`publishToServer requires a specified channel ("stable" or "insider"), but it received ${channel}`)
    }

    if (os !== "win" && os !== "osx" && os !== "linux") {
      throw new TypeError (`publishToServer requires a specified OS ("win", "osx" or "linux"), but it received ${os}`)
    }

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

    console.log(`Files to upload: ${[updateYmlName, ...latestFileNames] .join (", ")}`);

    // Actual server connection

    const client = new Client ()

    console.log("Connecting to server...");

    await client.connect ({
      protocol: "sftp",
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
    })

    let loggedProgress = false

    client.addListener("progress", (progress, info) => {
      if (loggedProgress) {
        process.stdout.clearLine(1);
        process.stdout.cursorTo(0);
      }
      else {
        loggedProgress = true
      }

      process.stdout.write(`Progress: ${progress.percent}%`);
    })

    console.log(`Server connection established`);

    for (const fileName of latestFileNames) {
      console.log(`Uploading ${fileName}`);

      loggedProgress = false
      const stream = fs.createReadStream (path.join (...distPath, fileName))
      await client.upload (`${serverPath}/${fileName}`, stream)

      console.log(`\nUpload done: ${fileName}`);
    }

    console.log(`Uploading ${updateYmlName}`);

    loggedProgress = false
    const updateYml = fs.createReadStream (path.join (...distPath, updateYmlName))
    await client.upload (`${serverPath}/${updateYmlName}`, updateYml)

    console.log(`\nUpload done: ${updateYmlName}`);

    await client.disconnect ()

    console.log("Closed server connection.");
  }

module.exports = {
  publishToServer
}

const getOS = () => {
  switch (os.platform()) {
    case "win32":
      return "win"
    case "darwin":
      return "osx"
    default:
      return "linux"
  }
}

// @ts-ignore
if (require.main === module) {
  const [channel] = process.argv.slice(2)
  const platform = getOS()

  console.log (channel, platform)

  // @ts-ignore
  publishToServer(channel, platform)
}
