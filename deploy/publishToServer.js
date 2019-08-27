// @ts-check

const ftp = require ("basic-ftp")
const fs = require ("fs")
const path = require ("path")
const semver = require ("semver");

/**
 * Needed env variables:
 * - `HOST`
 * - `USER`
 * - `PASSWORD`
 * - `UPLOAD_PATH` (universal)
 *
 * Needed command line args:
 *
 * `channel os`
 *
 * `channel = stable | insider`
 *
 * `os = win | osx | linux`
 */
const publishToServer = async () => {
  const channel = process.argv[2]
  const os = process.argv[3]

  if (channel !== "stable" && channel !== "insider") {
    throw new TypeError (`publishToServer requires a specified channel ("stable" or "insider"), but it received ${channel .toString ()}`)
  }

  if (os !== "win" && os !== "osx" && os !== "linux") {
    throw new TypeError (`publishToServer requires a specified OS ("win", "osx" or "linux"), but it received ${os .toString ()}`)
  }

  const Client = new ftp.Client ()

  await Client.access ({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    secure: true,
  })

  const subFolder = os === "win" ? "win" : os === "linux" ? "linux" : "mac"

  const updateYmlName =
    os === "win"
    ? "latest.yml"
    : os === "linux"
    ? "latest-linux.yml"
    : "latest-mac.yml"

  const distPath = channel === "insider" ? ["dist", "insider"] : ["dist"]

  const updateYml = fs.createReadStream (path.join (...distPath, updateYmlName))

  await Client.upload (updateYml, `${process.env.UPLOAD_PATH}/${subFolder}/${updateYmlName}`)

  const regex =
    channel === "insider"
    ? os === "win"
      ? /^OptolithInsiderSetup_(.+)\.exe$/
      : os === "linux"
      ? /^OptolithInsider_(.+)\.AppImage$/
      : /^OptolithInsider_(.+)\.(?:zip|dmg)$/
    : os === "win"
      ? /^OptolithSetup_(.+)\.exe$/
      : os === "linux"
      ? /^Optolith_(.+)\.AppImage$/
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
      */ v => [`OptolithInsider_${v}.AppImage`]
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
      */ v => [`Optolith_${v}.AppImage`]
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

  const latestFiles =
    latestFileNames
      .map (fileName => {
        const stream = fs.createReadStream (path.join (...distPath, fileName))

        return Client.upload (
          stream,
          `${process.env.UPLOAD_PATH}${channel === "insider" ? "/insider" : ""}/${subFolder}/${fileName}`
        )
      })

  for await (const res of latestFiles) {
    res;
  }

  Client.close ()
}

module.exports = publishToServer

publishToServer ()
