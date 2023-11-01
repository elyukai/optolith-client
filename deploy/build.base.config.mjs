// @ts-check
import { notarize } from "./notarize.mjs"

/**
 * @type {import("electron-builder").Configuration}
 */
export const baseConfig = {
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
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"],
      },
    ],
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
    entitlements: "deploy/entitlements.mac.plist",
    entitlementsInherit: "deploy/entitlements.mac.plist",
    hardenedRuntime: true,
    gatekeeperAssess: false,
  },
  dmg: {
    sign: false,
  },
  afterSign: notarize,
}
