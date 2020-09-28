// @ts-check
const os = require ("os")

module.exports = {
  /**
   * @typedef {"win" | "mac" | "linux"} System
   * @returns {System}
   */
  getSystem: () => {
    switch (os.platform()) {
      case "win32":
        return "win"
      case "darwin":
        return "mac"
      default:
        return "linux"
    }
  },
  /**
   * @param {System} system
   */
  getSystemName: system => {
    switch (system) {
      case "win":
        return "Windows"
      case "mac":
        return "macOS"
      case "linux":
        return "Linux"
    }
  }
}
