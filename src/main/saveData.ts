import { app } from "electron"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { prerelease } from "semver"

/**
 * Ensures that the user data path exists and returns it.
 */
export const ensureUserDataPathExists = async () => {
  const isPrerelease = prerelease(app.getVersion()) !== null
  const folderName = isPrerelease ? "Optolith Insider" : "Optolith"
  const userDataPath = path.join(app.getPath("appData"), folderName)

  // using recursive option to avoid errors if the folder already exists
  await fs.mkdir(userDataPath, { recursive: true })

  return userDataPath
}
