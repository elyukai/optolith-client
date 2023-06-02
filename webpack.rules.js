// @ts-check

import MiniCssExtractPlugin from "mini-css-extract-plugin"
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
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      }
    ],
    generator: {
      filename: "assets/css/[name].[hash][ext][query]"
    }
  },
]
