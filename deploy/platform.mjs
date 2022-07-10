// @ts-check
import { platform } from "os"

/**
 * @typedef {"win" | "mac" | "linux"} System
 * @returns {System}
 */
export const getSystem = () => {
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
