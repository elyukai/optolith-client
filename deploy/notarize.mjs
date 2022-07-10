// @ts-check
import { notarize as electronNotarize } from 'electron-notarize'

/**
 * @param context {import("electron-builder").AfterPackContext}
 */
export const notarize = async (context) => {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName === 'darwin') {
    const appName = context.packager.appInfo.productFilename

    console.log(`Notarizing "${appName}.app"...`)

    await electronNotarize({
      tool: "notarytool",
      appPath: `${appOutDir}/${appName}.app`,
      appleId: /** @type {string} */ (process.env.APPLEID),
      appleIdPassword: /** @type {string} */ (process.env.APPLEIDPASS),
      teamId: /** @type {string} */ (process.env.TEAMID),
    })

    console.log(`Notarization successful`)
  }
}
