// @ts-check

import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { isDevelopment } from "./webpack.env.js"

/**
 * @type {import("webpack").Configuration["plugins"]}
 */
export const rendererPlugins = [
  new HtmlWebpackPlugin({
    filename: "[name].html",
    template: "./src/template.html"
  }),
  new MiniCssExtractPlugin({
    filename: `assets/css/${isDevelopment ? '[name].css' : '[name].[hash].css'}`,
    chunkFilename: `assets/css/${isDevelopment ? '[id].css' : '[id].[hash].css'}`
  }),
]
