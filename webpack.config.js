// @ts-check

import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { mode } from "./webpack.env.js"
import { getOptimization } from "./webpack.optimization.js"
import { rendererPlugins } from "./webpack.plugins.js"
import { rules } from "./webpack.rules.js"

/**
 * @param {string} name
 * @return {import("webpack").Configuration[]}
 */
const createRendererConfig = name => [
  {
    name: `renderer_${name}`,
    mode,
    entry: {
      [`renderer_${name}`]: `./src/${name}_window/index.tsx`
    },
    target: "electron27-renderer",
    optimization: getOptimization(`renderer_${name}`),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false,
      conditionNames: ["browser", "default", "import", "require"],
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
    name: `renderer_${name}_preload`,
    mode,
    entry: {
      [`renderer_${name}_preload`]: `./src/${name}_window_preload/index.ts`
    },
    target: "electron27-preload",
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].cjs"
    }
  }
]

/** @type {import("webpack").Configuration[]} */
export default [
  {
    name: "main",
    mode,
    entry: {
      main: "./src/main/index.ts"
    },
    target: "electron27-main",
    optimization: getOptimization("main"),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].cjs"
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
    target: "electron27-main",
    optimization: getOptimization("database"),
    module: {
      rules: rules
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].cjs"
    },
    externalsPresets: {
      electronMain: true
    },
    externals: {
      "optolith-database-schema": "module optolith-database-schema",
    }
  },
  ...createRendererConfig("main"),
  ...createRendererConfig("updater"),
  ...createRendererConfig("settings"),
]
