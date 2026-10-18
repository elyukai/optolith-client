// @ts-check

import { RsdoctorRspackPlugin } from "@rsdoctor/core"
import rspack from "@rspack/core"
import HtmlWebpackPlugin from "html-webpack-plugin"

/**
 * @param {import("./rspack.config.js").EnvironmentMode} mode The current environment mode.
 * @returns {import("@rspack/core").Configuration["plugins"]} renderer plugins
 */
export const rendererPlugins = mode => [
  new HtmlWebpackPlugin({
    filename: "[name].html",
    template: "./src/template.html",
  }),
  new rspack.CssExtractRspackPlugin({
    filename: `assets/css/${mode === "development" ? "[name].css" : "[name].[hash].css"}`,
    chunkFilename: `assets/css/${mode === "development" ? "[id].css" : "[id].[hash].css"}`,
  }),
  process.env.RSDOCTOR &&
    new RsdoctorRspackPlugin({
      disableClientServer: true,
      output: { reportDir: ".rsdoctor/manifest.json" },
    }),
  new rspack.CircularCheckRspackPlugin(),
]
