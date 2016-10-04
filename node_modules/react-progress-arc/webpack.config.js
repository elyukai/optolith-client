{
  module.exports = {
    entry: "./lib/ProgressArc.js",
    output: {
      path: __dirname,
      filename: "./dist/react-progressarc.js",
      libraryTarget: "var",
      library: "ProgressArc"
    },
    externals: {
      "react": "React"
    }
  }
};
