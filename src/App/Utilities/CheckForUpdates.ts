import { platform } from "os"

export const isUpdaterEnabled = (app: Electron.App) => {
  const os = platform ()

  switch (os) {
    case "darwin":
      return false
    default:
      return app.isPackaged
  }
}
