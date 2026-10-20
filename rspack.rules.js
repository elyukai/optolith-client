// @ts-check

import rspack from "@rspack/core"

/**
 * @type {Required<import("@rspack/core").ModuleOptions>["rules"]}
 */
export const rules = [
  {
    test: /\.tsx?$/u,
    exclude: [/node_modules/u],
    type: "javascript/auto",
    loader: "builtin:swc-loader",
    resolve: {
      extensionAlias: {
        ".js": [".tsx", ".ts", "jsx", ".js"],
      },
    },
    /** @type {import('@rspack/core').SwcLoaderOptions} */
    options: {
      jsc: {
        keepClassNames: true,
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          react: {
            runtime: "automatic",
            throwIfNamespace: true,
            useBuiltins: false,
          },
          decoratorVersion: "2022-03",
        },
      },
    },
  },
  {
    test: /\.(png|jpe?g|svg)$/iu,
    type: "asset/resource",
    generator: {
      filename: "assets/images/[name].[hash][ext][query]",
    },
  },
  {
    test: /\.(icns|ico)$/iu,
    type: "asset/resource",
    generator: {
      filename: "assets/icons/[name].[hash][ext][query]",
    },
  },
  {
    test: /\.(ttf|otf|woff2?)$/iu,
    type: "asset/resource",
    generator: {
      filename: "assets/fonts/[name].[hash][ext][query]",
    },
  },
  {
    test: /\.(css|sass|scss)$/u,
    use: [
      rspack.CssExtractRspackPlugin.loader,
      "css-loader",
      "resolve-url-loader",
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
    generator: {
      filename: "assets/css/[name].[hash][ext][query]",
    },
    type: "javascript/auto",
  },
]
