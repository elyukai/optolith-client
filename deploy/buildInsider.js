// @ts-check

const builder = require ("electron-builder")
const { copyTables } = require ("./copyTablesCICD.js")
const { publishToServer } = require ("./publishToServer.js")

process.on ('unhandledRejection', error => {
  throw new Error (`Unhandled promise rejection: ${error .toString ()}`);
});

module.exports = {
  buildWindows:
    async () => {
      console.log ("Copy tables to directories...")
      await copyTables ()

      console.log ("Building Optolith Insider for Windows...")
      await builder.build ({ config, targets: builder.Platform.WINDOWS.createTarget () })
      console.log ("Optolith Insider Build for Windows successful.")

      await publishToServer ("insider", "win")
      console.log ("Optolith Insider Build for Windows deployed.")
    },
  buildLinux:
    async () => {
      console.log ("Copy tables to directories...")
      await copyTables ()

      console.log ("Building Optolith Insider for Linux...")
      await builder.build ({ config, targets: builder.Platform.LINUX.createTarget () })
      console.log ("Optolith Insider Build for Linux successful.")

      await publishToServer ("insider", "linux")
      console.log ("Optolith Insider Build for Linux deployed.")
    },
  buildMac:
    async () => {
      console.log ("Copy tables to directories...")
      await copyTables ()

      console.log ("Building Optolith Insider for OSX...")
      await builder.build ({ config, targets: builder.Platform.MAC.createTarget () })
      console.log ("Optolith Insider Build for OSX successful.")

      await publishToServer ("insider", "osx")
      console.log ("Optolith Insider Build for OSX deployed.")
    },
}

/**
 * @type {import ("electron-builder") .Configuration}
 */
const config = {
  appId: "lukasobermann.optolithinsider",
  productName: "Optolith Insider",
  copyright: "This product was created under a license. Das Schwarze Auge and its logo as well as Aventuria, Dere, Myranor, Riesland, Tharun and Uthuria and their logos are trademarks of Significant GbR. The title and contents of this book are protected under the copyright laws of the United States of America. No part of this publication may be reproduced, stored in retrieval systems or transmitted, in any form or by any means, whether electronic, mechanical, photocopy, recording, or otherwise, without prior written consent by Ulisses Spiele GmbH, Waldems. This publication includes material that is protected under copyright laws by Ulisses Spiele and/or other authors. Such material is used under the Community Content Agreement for the SCRIPTORIUM AVENTURIS. All other original materials in this work is copyright 2017-present by Lukas Obermann and published under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.",
  directories: {
    output: "dist/insider"
  },
  files: [
    "app/**/*"
  ],
  asarUnpack: "app/Database/**/*",
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
    artifactName: "OptolithInsiderSetup_${version}.${ext}"
  },
  nsis: {
    perMachine: true,
    differentialPackage: true
  },
  linux: {
    category: "RolePlaying",
    executableName: "OptolithInsider",
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
    artifactName: "OptolithInsider_${version}.${ext}"
  },
  mac: {
    category: "public.app-category.role-playing-games",
    type: "distribution",
    icon: "app/icon.icns",
    target: "default",
    artifactName: "OptolithInsider_${version}.${ext}"
  },
  publish: {
    "provider": "generic",
    "url": process.env.PUBLISH_URL_INSIDER,
    "channel": "latest"
  }
}
