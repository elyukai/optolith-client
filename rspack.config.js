// @ts-check

import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
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
    target: "electron27-renderer",
    optimization: getOptimization(`renderer_${name}`),
    module: {
      rules: rules,
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
    plugins: rendererPlugins(mode),
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
    target: "electron27-preload",
    module: {
      rules: rules,
    },
    resolve: {
      symlinks: false,
    },
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
      filename: "[name].cjs",
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
      target: "electron27-main",
      optimization: getOptimization("main"),
      module: {
        rules: rules,
      },
      resolve: {
        symlinks: false,
      },
      output: {
        path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
        filename: "[name].cjs",
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
      target: "electron27-main",
      optimization: getOptimization("database"),
      module: {
        rules: rules,
      },
      resolve: {
        symlinks: false,
      },
      output: {
        path: resolve(dirname(fileURLToPath(import.meta.url)), ".webpack"),
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
