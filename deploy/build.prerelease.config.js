// @ts-check
import { baseConfig } from "./build.base.config.js"

/**
 * @type {import("electron-builder").Configuration}
 */
export const prereleaseConfig = {
  ...baseConfig,
  appId: "com.lukasobermann.optolithinsider",
  productName: "Optolith Insider",
  directories: {
    output: "dist/insider",
  },
  win: {
    ...baseConfig.win,
    icon: "src/assets/icon/AppList.targetsize-512.pre.png",
    artifactName: "OptolithInsiderSetup_${version}.${ext}",
  },
  linux: {
    ...baseConfig.linux,
    executableName: "OptolithInsider",
    icon: "src/assets/icon/icon.pre.png",
    artifactName: "OptolithInsider_${version}.${ext}",
  },
  mac: {
    ...baseConfig.mac,
    icon: "src/assets/icon/AppIcon.pre.icns",
    artifactName: "OptolithInsider_${version}.${ext}",
  },
  publish: {
    provider: "generic",
    url: `${process.env.UPDATE_URL}/insider/\${os}`,
    channel: "latest",
  },
}
