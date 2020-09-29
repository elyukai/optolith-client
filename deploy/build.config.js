/**
 * @type {import ("electron-builder") .Configuration}
 */
module.exports = {
  appId: "com.lukasobermann.optolith",
  productName: "Optolith",
  copyright: "This product was created under a license. Das Schwarze Auge and its logo as well as Aventuria, Dere, Myranor, Riesland, Tharun and Uthuria and their logos are trademarks of Significant GbR. The title and contents of this book are protected under the copyright laws of the United States of America. No part of this publication may be reproduced, stored in retrieval systems or transmitted, in any form or by any means, whether electronic, mechanical, photocopy, recording, or otherwise, without prior written consent by Ulisses Spiele GmbH, Waldems. This publication includes material that is protected under copyright laws by Ulisses Spiele and/or other authors. Such material is used under the Community Content Agreement for the SCRIPTORIUM AVENTURIS. All other original materials in this work is copyright 2017-present by Lukas Obermann and published under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.",
  directories: {
    output: "dist"
  },
  files: [
    "app/**/*",
    "LICENSE"
  ],
  win: {
    target: [
      {
        target: "nsis",
        arch: [
          "x64",
          "ia32"
        ]
      }
    ],
    icon: "app/icon.ico",
    artifactName: "OptolithSetup_${version}.${ext}"
  },
  nsis: {
    perMachine: true,
    differentialPackage: true,
    deleteAppDataOnUninstall: false,
  },
  linux: {
    category: "RolePlaying",
    executableName: "Optolith",
    icon: "app",
    target: [
      {
        target: "AppImage",
        arch: [
          "x64"
        ]
      },
      {
        target: "tar.gz",
        arch: [
          "x64"
        ]
      }
    ],
    artifactName: "Optolith_${version}.${ext}"
  },
  mac: {
    category: "public.app-category.role-playing-games",
    type: "distribution",
    icon: "app/icon.icns",
    target: "default",
    artifactName: "Optolith_${version}.${ext}",
    hardenedRuntime: true,
    // entitlements: "deploy/entitlements.mac.plist",
    // entitlementsInherit: "deploy/entitlements.mac.plist",
    gatekeeperAssess: false,
  },
  dmg: {
    sign: false,
  },
  publish: {
    "provider": "generic",
    "url": `${process.env.UPDATE_URL}/\${os}`,
    "channel": "latest"
  },
  // afterSign: notarize,
}
