// @ts-check

import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { mode } from "./webpack.env.js"
import { getOptimization } from "./webpack.optimization.js"
import { rendererPlugins } from "./webpack.plugins.js"
import { rules } from "./webpack.rules.js"

/** @type {import("webpack").Configuration[]} */
export default [
  {
    name: "main",
    mode,
    entry: {
      main: "./src/main/index.ts"
    },
    target: "electron-main",
    optimization: getOptimization("main"),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].js"
    },
    externalsPresets: {
      electronMain: true
    }
  },
  {
    name: "database",
    mode,
    entry: {
      database: "./src/database/index.ts"
    },
    target: "electron-main",
    optimization: getOptimization("database"),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].js"
    },
    externalsPresets: {
      electronMain: true
    }
  },
  {
    name: "renderer_main",
    mode,
    entry: {
      renderer_main: "./src/main_window/index.tsx",
    },
    target: "electron-renderer",
    optimization: getOptimization("renderer_main"),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].js",
      globalObject: "globalThis",
    },
    plugins: rendererPlugins,
    externalsPresets: {
      electronRenderer: true
    },
    profile: true,
    devtool: "source-map",
  },
  {
    name: "renderer_main_preload",
    mode,
    entry: {
      renderer_main_preload: "./src/main_window_preload/index.ts"
    },
    target: "electron-preload",
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].js"
    }
  },
  {
    name: "renderer_updater",
    mode,
    entry: {
      renderer_updater: "./src/updater_window/index.tsx"
    },
    target: "electron-renderer",
    optimization: getOptimization("renderer_updater"),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].js",
      globalObject: "globalThis",
    },
    plugins: rendererPlugins,
    externalsPresets: {
      electronRenderer: true
    },
    profile: true,
    devtool: "source-map",
  },
  {
    name: "renderer_updater_preload",
    mode,
    entry: {
      renderer_updater_preload: "./src/updater_window_preload/index.ts"
    },
    target: "electron-preload",
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].js"
    }
  }
]
