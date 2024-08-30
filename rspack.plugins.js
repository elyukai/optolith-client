// @ts-check

import rspack from "@rspack/core"

/**
 *
 * @param {import("./rspack.config.js").EnvironmentMode} mode
 * @returns {import("@rspack/core").Configuration["plugins"]}
 */
export const rendererPlugins = (mode) => [
  new rspack.HtmlRspackPlugin({
    filename: "[name].html",
    template: "./src/template.html",
  }),
  new rspack.CssExtractRspackPlugin({
    filename: `assets/css/${mode === "development" ? "[name].css" : "[name].[hash].css"}`,
    chunkFilename: `assets/css/${mode === "development" ? "[id].css" : "[id].[hash].css"}`,
  }),
]
