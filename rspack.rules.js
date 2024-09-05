// @ts-check

import rspack from "@rspack/core"

/**
 * @type {Required<import("@rspack/core").ModuleOptions>["rules"]}
 */
export const rules = [
  {
    test: /\.tsx?$/,
    exclude: [/node_modules/],
    loader: "builtin:swc-loader",
    resolve: {
      extensionAlias: {
        '.js': ['.tsx', '.ts', 'jsx', '.js'],
      },
    },
    options: {
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        transform: {
          react: {
            runtime: 'automatic',
            throwIfNamespace: true,
            useBuiltins: false,
          },
        },
      },
    },
    type: 'javascript/auto',
  },
  {
    test: /\.(png|jpe?g|svg)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/images/[name].[hash][ext][query]",
    },
  },
  {
    test: /\.(icns|ico)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/icons/[name].[hash][ext][query]",
    },
  },
  {
    test: /\.(ttf|otf|woff2?)$/i,
    type: "asset/resource",
    generator: {
      filename: "assets/fonts/[name].[hash][ext][query]",
    },
  },
  {
    test: /\.(css|sass|scss)$/,
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
