// @ts-check

import { resolve } from "node:path"
import { getOptimization } from "./rspack.optimization.js"
import { rendererPlugins } from "./rspack.plugins.js"
import { rules } from "./rspack.rules.js"

/**
 * @param {string} name
 * @param {EnvironmentMode} mode
 * @returns {import("@rspack/core").Configuration[]}
 */
const createRendererConfig = (name, mode) => [
  {
    name: `renderer_${name}`,
    mode,
    entry: {
      [`renderer_${name}`]: `./src/${name}_window/index.tsx`,
    },
    target: "electron-renderer",
    optimization: getOptimization(`renderer_${name}`),
    module: {
      rules: rules,
    },
    resolve: {
      symlinks: false,
      conditionNames: ["browser", "default", "import", "require"],
    },
    output: {
      path: resolve(import.meta.dirname, ".webpack"),
      filename: "[name].js",
      globalObject: "globalThis",
    },
    plugins: rendererPlugins(mode),
    externals: {
      "electron/renderer": "commonjs electron/renderer",
      "electron/common": "commonjs electron/common",
    },
    externalsPresets: {
      electronRenderer: true,
    },
    profile: true,
    devtool: "source-map",
  },
  {
    name: `renderer_${name}_preload`,
    mode,
    entry: {
      [`renderer_${name}_preload`]: `./src/${name}_window_preload/index.ts`,
    },
    target: "electron-preload",
    module: {
      rules: rules,
    },
    resolve: {
      symlinks: false,
    },
    output: {
      path: resolve(import.meta.dirname, ".webpack"),
      filename: "[name].cjs",
    },
    externals: {
      "electron/renderer": "commonjs electron/renderer",
      "electron/common": "commonjs electron/common",
    },
    externalsPresets: {
      electronPreload: true,
    },
  },
]

/**
 * @typedef {"development" | "production"} EnvironmentMode
 * @returns {import("@rspack/core").Configuration[]}
 */
export default () => {
  /** @type {EnvironmentMode} */
  const mode = process.env.NODE_ENV === "production" ? "production" : "development"

  return [
    {
      name: "main",
      mode,
      entry: {
        main: "./src/main/index.ts",
      },
      target: "electron-main",
      optimization: getOptimization("main"),
      module: {
        rules: rules,
      },
      resolve: {
        symlinks: false,
      },
      output: {
        path: resolve(import.meta.dirname, ".webpack"),
        filename: "[name].cjs",
      },
      externals: {
        "electron/main": "commonjs electron/main",
        "electron/common": "commonjs electron/common",
      },
      externalsPresets: {
        electronMain: true,
      },
    },
    {
      name: "database",
      mode,
      entry: {
        database: "./src/database/index.ts",
      },
      target: "electron-main",
      optimization: getOptimization("database"),
      module: {
        rules: rules,
      },
      resolve: {
        symlinks: false,
      },
      output: {
        path: resolve(import.meta.dirname, ".webpack"),
        filename: "[name].cjs",
      },
      externalsPresets: {
        electronMain: true,
      },
      externals: {
        "optolith-database-schema": "module optolith-database-schema",
      },
    },
    ...createRendererConfig("main", mode),
    ...createRendererConfig("updater", mode),
    ...createRendererConfig("settings", mode),
  ]
}
