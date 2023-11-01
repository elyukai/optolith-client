// @ts-check
import { baseConfig } from "./build.base.config.mjs"

/**
 * @type {import("electron-builder").Configuration}
 */
export const stableConfig = {
  ...baseConfig,
  appId: "com.lukasobermann.optolith",
  productName: "Optolith",
  directories: {
    output: "dist",
  },
  win: {
    ...baseConfig.win,
    icon: "src/assets/icon/icon.ico",
    artifactName: "OptolithSetup_${version}.${ext}",
  },
  linux: {
    ...baseConfig.linux,
    executableName: "Optolith",
    icon: "src/assets/icon/AppList.targetsize-512.png",
    artifactName: "Optolith_${version}.${ext}",
  },
  mac: {
    ...baseConfig.mac,
    icon: "src/assets/icon/AppIcon.icns",
    artifactName: "Optolith_${version}.${ext}",
  },
  publish: {
    provider: "generic",
    url: `${process.env.UPDATE_URL}/\${os}`,
    channel: "latest",
  },
}
