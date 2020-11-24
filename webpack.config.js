// @ts-check

const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import("webpack").Configuration[]} */
const config = [
  {
    mode: 'development',
    entry: './src/main.bs.js',
    target: 'electron-main',
    output: {
      path: __dirname + '/dist',
      filename: 'main.js'
    }
  },
  {
    mode: 'development',
    entry: './src/Init/InitWorker.bs.js',
    target: 'electron-main',
    output: {
      path: __dirname + '/dist',
      filename: 'initWorker.js'
    }
  },
  {
    mode: 'development',
    entry: './src/Renderer.bs.js',
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
      path: __dirname + '/dist',
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
