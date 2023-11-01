// @ts-check
import { platform } from "os"

const [_channel, ...args] = process.argv.slice(2)

/**
 * @typedef {"win" | "mac" | "linux"} System
 * @returns {System}
 */
export const getSystem = () => {
  if (args.includes("--linux")) {
    return "linux"
  } else if (args.includes("--mac")) {
    return "mac"
  } else if (args.includes("--win")) {
    return "win"
  }

  switch (platform()) {
    case "win32":  return "win"
    case "darwin": return "mac"
    default:       return "linux"
  }
}

/**
 * @param {System} system
 */
export const getSystemName = system => {
  switch (system) {
    case "win":   return "Windows"
    case "mac":   return "macOS"
    case "linux": return "Linux"
  }
}
