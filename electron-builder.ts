import type { Configuration } from "electron-builder"

const isPrerelease = process.env.CHANNEL === "prerelease"

console.log(`Detected channel: ${isPrerelease ? "prerelease" : "stable"}`)

const config: Configuration = {
  appId: isPrerelease ? "com.lukasobermann.optolithinsider" : "com.lukasobermann.optolith",
  productName: isPrerelease ? "Optolith Insider" : "Optolith",
  copyright:
    "© 2017–present Lukas Obermann. This product was created under a license. Das Schwarze Auge and its logo as well as Aventuria, Dere, Myranor, Riesland, Tharun and Uthuria and their logos are trademarks of Significant GbR. The title and contents of this book are protected under the copyright laws of the United States of America. No part of this publication may be reproduced, stored in retrieval systems or transmitted, in any form or by any means, whether electronic, mechanical, photocopy, recording, or otherwise, without prior written consent by Ulisses Spiele GmbH, Waldems. This publication includes material that is protected under copyright laws by Ulisses Spiele and/or other authors. Such material is used under the Community Content Agreement for the SCRIPTORIUM AVENTURIS. All other original materials in this work is copyright 2017-present by Lukas Obermann and published under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.",
  files: ["!deploy", "!docs", "!src", "!**.p8"],
  // asarUnpack: [
  //   "node_modules/optolith-character-schema/**",
  //   "node_modules/optolith-database-schema/**",
  //   "src/database/contents/**",
  // ],
  // directories: {
  //   output: isPrerelease ? "dist/insider" : "dist/stable",
  // },
  win: {
    target: [
      {
        target: "nsis",
        arch: "x64",
      },
    ],
    icon: isPrerelease
      ? "src/assets/icon/AppList.targetsize-512.pre.png"
      : "src/assets/icon/icon.ico",
    artifactName: isPrerelease
      ? "OptolithInsiderSetup_${version}.${ext}"
      : "OptolithSetup_${version}.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    differentialPackage: true,
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
    icon: isPrerelease
      ? "src/assets/icon/icon.pre.png"
      : "src/assets/icon/AppList.targetsize-512.png",
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
    icon: isPrerelease ? "src/assets/icon/AppIcon.pre.icon" : "src/assets/icon/AppIcon.icon",
    artifactName: isPrerelease ? "OptolithInsider_${version}.${ext}" : "Optolith_${version}.${ext}",
    darkModeSupport: true,
    gatekeeperAssess: true,
  },
  publish: {
    provider: "generic",
    url: isPrerelease ? `${process.env.UPDATE_URL}/insider` : `${process.env.UPDATE_URL}/stable`,
  },
}

export default config
