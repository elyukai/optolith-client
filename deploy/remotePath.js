// @ts-check
import { join } from "path/posix"

/**
 * @param {"prerelease" | "stable"} channel
 */
const remoteChannelPath = channel => {
  switch (channel) {
    case "prerelease": return "insider"
    case "stable":     return "."
  }
}

/**
 * @param {import("./platform.js").System} os
 */
const remoteOsPath = os => {
  switch (os) {
    case "win":   return "win"
    case "linux": return "linux"
    default:      return "mac"
  }
}

/**
 * @param {string} root
 * @param {"prerelease" | "stable"} channel
 * @param {import("./platform.js").System} os
 */
export const getRemotePath = (root, channel, os) =>
  join(root, remoteChannelPath(channel), remoteOsPath(os))
