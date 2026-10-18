// @ts-check

/**
 * @param {string} processType The name of the Electron process
 * @returns {import("@rspack/core").Configuration["optimization"]} optimization configuration for the given process type
 */
export const getOptimization = processType => ({
  splitChunks: {
    chunks: "all",
    cacheGroups: {
      default: {
        name: processType,
        minChunks: 2,
        priority: -20,
      },
      defaultVendors: {
        name: `${processType}_vendors`,
        test: /[\\/]node_modules[\\/]/u,
        priority: -10,
        reuseExistingChunk: true,
      },
    },
  },
  minimize: false,
})
