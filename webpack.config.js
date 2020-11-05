// @ts-check

const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import("webpack").Configuration[]} */
const config = [
  {
    mode: 'development',
    entry: './src/main.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          loader: 'ts-loader',
          resolve: {
            extensions: [".ts", ".tsx", ".js"],
          },
          options: {
            configFile: "tsconfig.webpack.json"
          }
        }
      ]
    },
    output: {
      path: __dirname + '/app',
      filename: 'main.js'
    }
  },
  {
    mode: 'development',
    entry: './src/entry.tsx',
    target: 'node',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          loader: 'ts-loader',
          resolve: {
            extensions: [".ts", ".tsx", ".js"],
          },
          options: {
            configFile: "tsconfig.webpack.json"
          }
        }
      ]
    },
    output: {
      path: __dirname + '/app',
      filename: 'renderer.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      })
    ],
    externals: {
      electron: "commonjs electron"
    }
  }
]

module.exports = config
