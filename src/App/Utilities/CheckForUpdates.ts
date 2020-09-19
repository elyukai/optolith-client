import { platform } from "os"

export const isUpdaterEnabled = (app: Electron.App) => {
  const os = platform ()

  switch (os) {
    case "win32":
      return app.isPackaged
    default:
      return false
  }
}
