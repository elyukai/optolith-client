// @ts-check

import HtmlWebpackPlugin from "html-webpack-plugin";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getOptimization } from "./webpack.optimization.js";
import { rules } from "./webpack.rules.js";

/** @type {import("webpack").Configuration[]} */
export default [
  {
    name: "main",
    mode: "development",
    entry: {
      main: "./src/main.ts"
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
    mode: "development",
    entry: {
      database: "./src/database.ts"
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
    mode: "development",
    entry: {
      renderer_main: "./src/renderers/main/entry.tsx",
    },
    target: "electron-renderer",
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
    plugins: [
      new HtmlWebpackPlugin({
        filename: "[name].html",
        template: "./src/renderers/template.html"
      })
    ],
    externalsPresets: {
      electronRenderer: true
    },
    profile: true
  },
  {
    name: "renderer_main_preload",
    mode: "development",
    entry: {
      renderer_main_preload: "./src/renderers/main/preload.ts"
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
    mode: "development",
    entry: {
      renderer_updater: "./src/renderers/updater/entry.tsx"
    },
    target: "electron-renderer",
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
    plugins: [
      new HtmlWebpackPlugin({
        filename: "[name].html",
        template: "./src/renderers/template.html"
      })
    ],
    externalsPresets: {
      electronRenderer: true
    },
    profile: true
  },
  {
    name: "renderer_updater_preload",
    mode: "development",
    entry: {
      renderer_updater_preload: "./src/renderers/updater/preload.ts"
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
