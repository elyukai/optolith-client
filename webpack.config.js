// @ts-check

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

/** @type {import("webpack").Configuration[]} */
const config = [
  {
    name: 'main',
    mode: 'development',
    entry: {
      main: './src/main.ts'
    },
    target: 'electron-main',
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: {
            name: 'main',
            minChunks: 2,
            priority: -20
          },
          defaultVendors: {
            name: 'main-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'ts-loader',
          resolve: {
            extensions: [".ts", ".tsx", ".js"]
          },
          options: {
            configFile: "tsconfig.webpack.json",
            transpileOnly: true
          }
        }
      ]
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: __dirname + '/app',
      filename: '[name].js'
    },
    externalsPresets: {
      electronMain: true
    }
  },
  {
    name: 'renderer',
    mode: 'development',
    entry: {
      renderer: './src/renderer.tsx'
    },
    target: 'node',
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: {
            name: 'renderer',
            minChunks: 2,
            priority: -20
          },
          defaultVendors: {
            name: 'renderer-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'ts-loader',
          resolve: {
            extensions: [".ts", ".tsx", ".js"]
          },
          options: {
            configFile: "tsconfig.webpack.json",
            transpileOnly: true
          }
        }
      ]
    },
    resolve: {
      symlinks: false
    },
    output: {
      path: __dirname + '/app',
      filename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],
    externalsPresets: {
      electronRenderer: true
    },
    profile: true
  }
]

module.exports = config
