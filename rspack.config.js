// @ts-check

import { resolve } from "node:path"
import { getOptimization } from "./rspack.optimization.js"
import { rendererPlugins } from "./rspack.plugins.js"
import { rules } from "./rspack.rules.js"

const ELECTRON_MAJOR_VERSION = 45
const ELECTRON_NODE_MAJOR_VERSION = 24

/** @type {import("@rspack/core").WatchOptions | undefined} */
const watchOptions = {
  ignored: /[\\/]\.git[\\/]/,
}

/**
 * @param {string} name
 * @param {EnvironmentMode} mode
 * @returns {import("@rspack/core").Configuration[]}
 */
const createRendererConfig = (name, mode) => [
  {
    watchOptions,
    name: `renderer_${name}`,
    mode,
    entry: {
      [`renderer_${name}`]: `./src/${name}_window/index.tsx`,
    },
    target: `electron${ELECTRON_MAJOR_VERSION}-renderer`,
    optimization: getOptimization(`renderer_${name}`),
    module: {
      rules: rules,
    },
    resolve: {
      conditionNames: ["browser", "default", "import", "require"],
      tsConfig: resolve(import.meta.dirname, "./tsconfig.json"),
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
    devtool: "source-map",
  },
  {
    watchOptions,
    name: `renderer_${name}_preload`,
    mode,
    entry: {
      [`renderer_${name}_preload`]: `./src/${name}_window_preload/index.ts`,
    },
    target: ["web", "es2025"],
    module: {
      rules: rules,
    },
    resolve: {
      tsConfig: resolve(import.meta.dirname, "./tsconfig.json"),
    },
    output: {
      path: resolve(import.meta.dirname, ".webpack"),
      filename: "[name].cjs",
    },
    externals: {
      electron: "commonjs electron",
      "electron/renderer": "commonjs electron/renderer",
      "electron/common": "commonjs electron/common",
    },
    optimization: {
      minimize: false,
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
      watchOptions,
      name: "main",
      mode,
      entry: {
        main: "./src/main/index.ts",
      },
      target: `electron${ELECTRON_MAJOR_VERSION}-main`,
      optimization: getOptimization("main"),
      module: {
        rules: rules,
      },
      resolve: {
        tsConfig: resolve(import.meta.dirname, "./tsconfig.json"),
      },
      output: {
        path: resolve(import.meta.dirname, ".webpack"),
        filename: "[name].mjs",
        module: true,
        chunkFormat: "module",
        chunkLoading: "import",
        workerChunkLoading: "import",
      },
      externals: {
        "electron/main": "module electron/main",
        "electron/common": "module electron/common",
        tsondb: "module tsondb",
        "tsondb/readonly": "module tsondb/readonly",
      },
      externalsPresets: {
        electronMain: true,
      },
    },
    // {
    //   watchOptions,
    //   name: "database",
    //   mode,
    //   entry: {
    //     database: "./src/database/index.ts",
    //   },
    //   target: `electron${ELECTRON_MAJOR_VERSION}-main`,
    //   optimization: getOptimization("database"),
    //   module: {
    //     rules: rules,
    //   },
    //   resolve: {
    //     tsConfig: resolve(import.meta.dirname, "./tsconfig.json"),
    //   },
    //   output: {
    //     path: resolve(import.meta.dirname, ".webpack"),
    //     filename: "[name].mjs",
    //     scriptType: "module",
    //   },
    //   externalsPresets: {
    //     electronMain: true,
    //   },
    //   externals: {
    //     "@optolith/database-schema": "module @optolith/database-schema",
    //   },
    // },
    ...createRendererConfig("main", mode),
    ...createRendererConfig("updater", mode),
    ...createRendererConfig("settings", mode),
  ]
}
