// @ts-check
import builder from "electron-builder"
import { notarize } from "./notarize.js"

const args = process.argv.slice(2)

// Detect channel

if (!args.includes("--stable") && !args.includes("--prerelease")) {
  throw new TypeError(`Missing channel argument (either "--stable" or "--prerelease")`)
}

const isPrerelease = args.includes("--prerelease")

console.log(`Detected channel: ${isPrerelease ? "prerelease" : "stable"}`)

// Detect OS

let osKey
let osName

if (process.argv.includes("--linux") || process.platform === "linux") {
  osKey = /** @type {const} */ ("LINUX")
  osName = "Linux"
} else if (process.argv.includes("--mac") || process.platform === "darwin") {
  osKey = /** @type {const} */ ("MAC")
  osName = "macOS"
} else if (process.argv.includes("--win") || process.platform === "win32") {
  osKey = /** @type {const} */ ("WINDOWS")
  osName = "Windows"
} else {
  throw new TypeError(`The target operating system cannot be inferred from the environment.`)
}

console.log(`Detected operating system: ${osName}`)

// Prepare electron-builder configuration

/**
 * @type {import("electron-builder").Configuration}
 */
const config = {
  appId: isPrerelease ? "com.lukasobermann.optolithinsider" : "com.lukasobermann.optolith",
  productName: isPrerelease ? "Optolith Insider" : "Optolith",
  copyright:
    "© 2017–present Lukas Obermann. This product was created under a license. Das Schwarze Auge and its logo as well as Aventuria, Dere, Myranor, Riesland, Tharun and Uthuria and their logos are trademarks of Significant GbR. The title and contents of this book are protected under the copyright laws of the United States of America. No part of this publication may be reproduced, stored in retrieval systems or transmitted, in any form or by any means, whether electronic, mechanical, photocopy, recording, or otherwise, without prior written consent by Ulisses Spiele GmbH, Waldems. This publication includes material that is protected under copyright laws by Ulisses Spiele and/or other authors. Such material is used under the Community Content Agreement for the SCRIPTORIUM AVENTURIS. All other original materials in this work is copyright 2017-present by Lukas Obermann and published under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.",
  files: [
    ".webpack/**",
    "LICENSE",
    "node_modules/optolith-database-schema/schema/**",
    "src/database/contents/cache/**",
    "src/database/contents/Compatibility/**",
    "src/database/contents/Data/**",
  ],
  asar: false, // otherwise optolith-database-schema package is not properly resolved
  asarUnpack: [
    "node_modules/optolith-character-schema/**",
    "node_modules/optolith-database-schema/**",
    "src/database/contents/**",
  ],
  directories: {
    output: isPrerelease ? "dist/insider" : "dist",
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"],
      },
    ],
    icon: isPrerelease ? "src/assets/icon/AppList.targetsize-512.pre.png" : "src/assets/icon/icon.ico",
    artifactName: isPrerelease ? "OptolithInsiderSetup_${version}.${ext}" : "OptolithSetup_${version}.${ext}",
  },
  nsis: {
    perMachine: true,
    differentialPackage: true,
    deleteAppDataOnUninstall: false,
  },
  linux: {
    category: "RolePlaying",
    target: [
      {
        target: "AppImage",
        arch: ["x64"],
      },
      {
        target: "tar.gz",
        arch: ["x64"],
      },
    ],
    executableName: isPrerelease ? "OptolithInsider" : "Optolith",
    icon: isPrerelease ? "src/assets/icon/icon.pre.png" : "src/assets/icon/AppList.targetsize-512.png",
    artifactName: isPrerelease ? "OptolithInsider_${version}.${ext}" : "Optolith_${version}.${ext}",
  },
  mac: {
    category: "public.app-category.role-playing-games",
    type: "distribution",
    target: [
      {
        target: "default",
        arch: "universal",
      },
    ],
    icon: isPrerelease ? "src/assets/icon/AppIcon.pre.icns" : "src/assets/icon/AppIcon.icns",
    artifactName: isPrerelease ? "OptolithInsider_${version}.${ext}" : "Optolith_${version}.${ext}",
    mergeASARs: false,
    darkModeSupport: true,
    gatekeeperAssess: true,
  },
  publish: {
    provider: "generic",
    url: isPrerelease ? `${process.env.UPDATE_URL}/insider/\${os}` : `${process.env.UPDATE_URL}/\${os}`,
    channel: "latest",
  },
  afterSign: osKey === "MAC" ? notarize : undefined,
}

await builder.build({
  config,
  targets: builder.Platform[osKey].createTarget(),
})

console.log(`Build finished successfully.`)
