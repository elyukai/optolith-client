// @ts-check
import { notarize as electronNotarize } from "@electron/notarize"
import { isAbsolute, join } from "node:path"

/**
 * Notarizes the app package after it has been built. It detects the
 * authentication method from the environment variables.
 * @param context {import("electron-builder").AfterPackContext}
 */
export const notarize = async context => {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName === "darwin") {
    const appName = context.packager.appInfo.productFilename

    if (
      typeof process.env.APPLEID === "string" &&
      typeof process.env.APPLEIDPASS === "string" &&
      typeof process.env.TEAMID === "string"
    ) {
      console.log(`Notarizing "${appName}.app" via Apple ID ...`)
      await electronNotarize({
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
        teamId: process.env.TEAMID,
      })
      console.log(`Notarization successful`)
    } else if (
      typeof process.env.APPLEAPIKEY === "string" &&
      typeof process.env.APPLEAPIKEYID === "string"
    ) {
      console.log(`Notarizing "${appName}.app" via App Store Connect API ...`)
      await electronNotarize({
        appPath: `${appOutDir}/${appName}.app`,
        appleApiKey: isAbsolute(process.env.APPLEAPIKEY)
          ? process.env.APPLEAPIKEY
          : join(process.cwd(), process.env.APPLEAPIKEY),
        appleApiKeyId: process.env.APPLEAPIKEYID,
        appleApiIssuer: process.env.APPLEAPIISSUER,
      })
      console.log(`Notarization successful`)
    } else if (typeof process.env.KEYCHAINPROFILE === "string") {
      console.log(`Notarizing "${appName}.app" via Keychain ...`)
      await electronNotarize({
        appPath: `${appOutDir}/${appName}.app`,
        keychain: process.env.KEYCHAIN,
        keychainProfile: process.env.KEYCHAINPROFILE,
      })
      console.log(`Notarization successful`)
    } else {
      throw new Error(
        `Notarization failed: No valid authentication method found in environment. Please provide either APPLEID and APPLEIDPASS, or APPLEAPIKEY, APPLEAPIKEYID and APPLEAPIISSUER, or (optional) KEYCHAIN and KEYCHAINPROFILE.`,
      )
    }
  }
}
