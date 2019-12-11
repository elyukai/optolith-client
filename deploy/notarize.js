// @ts-check

const { notarize } = require ('electron-notarize')

/**
 * @param context {import("electron-builder").AfterPackContext}
 */
exports.notarize = async context => {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName === 'darwin') {
    const appName = context.packager.appInfo.productFilename

    console.log (`Notarizing "${appName}.app"...`)

    await notarize ({
      appBundleId: 'com.lukasobermann.optolith',
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLEID,
      appleIdPassword: process.env.APPLEIDPASS,
    })

    console.log (`Notarization successful`)

    return
  }

  return
}
