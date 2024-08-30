// @ts-check

/**
 * @param {string} processType
 * @returns {import("@rspack/core").Configuration["optimization"]}
 */
export const getOptimization = (processType) => ({
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
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
    },
  },
})
