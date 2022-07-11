// @ts-check
/**
 * @param {"prerelease" | "stable"} channel
 */
const channelSuffix = channel => {
  switch (channel) {
    case "prerelease": return "Insider"
    case "stable":     return ""
  }
}

/**
 * @param {import("./platform.mjs").System} os
 * @param {"prerelease" | "stable"} channel
 */
const prefix = (os, channel) => {
  switch (os) {
    case "win":   return `Optolith${channelSuffix(channel)}Setup`
    case "linux":
    case "mac":   return `Optolith${channelSuffix(channel)}`
  }
}

/**
 * @param {import("./platform.mjs").System} os
 */
const extensions = os => {
  switch (os) {
    case "win":   return [".exe", ".exe.blockmap"]
    case "linux": return [".AppImage", ".tar.gz"]
    case "mac":   return [".dmg", ".dmg.blockmap", ".zip", ".zip.blockmap"]
  }
}

/**
 * @param {import("./platform.mjs").System} os
 * @param {"prerelease" | "stable"} channel
 * @param {string} version
 */
export const getApplicationFileNames = (os, channel, version) =>
  extensions(os).map(ext => `${prefix(os, channel)}_${version}${ext}`)

/**
 * @param {"win" | "mac" | "linux"} os
 */
export const getUpdateFileName = os => {
  switch (os) {
    case "win":   return "latest.yml"
    case "linux": return "latest-linux.yml"
    default:      return "latest-mac.yml"
  }
}
