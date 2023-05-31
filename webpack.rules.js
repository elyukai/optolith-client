// @ts-check

import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

/**
 * @type {Required<import("webpack").ModuleOptions>["rules"]}
 */
export const rules = [
  {
    test: /\.tsx?$/,
    include: resolve(dirname(fileURLToPath(import.meta.url)), "src"),
    loader: "ts-loader",
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    options: {
      configFile: "tsconfig.webpack.json",
      transpileOnly: true
    }
  },
  {
    test: /\.(png|jpe?g|svg)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/images/[name].[hash][ext][query]"
    }
  },
  {
    test: /\.(icns|ico)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/icons/[name].[hash][ext][query]"
    }
  },
  {
    test: /\.(ttf|otf|woff2?)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/fonts/[name].[hash][ext][query]"
    }
  },
  {
    test: /\.(css|sass|scss)$/,
    use: ['css-loader', 'sass-loader'],
  },
]
