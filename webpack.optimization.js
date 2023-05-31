// @ts-check

/**
 * @param {string} processType
 * @returns {Required<import("webpack").Configuration>["optimization"]}
 */
export const getOptimization = (processType) => ({
  splitChunks: {
    chunks: "all",
    cacheGroups: {
      default: {
        name: processType,
        minChunks: 2,
        priority: -20
      },
      defaultVendors: {
        name: `${processType}-vendors`,
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      }
    }
  }
})
