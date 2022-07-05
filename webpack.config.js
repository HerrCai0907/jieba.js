const path = require("path");
const { BannerPlugin } = require("webpack");
const { version, author, description, name } = require("./package.json");

module.exports = {
  mode: "development",
  target: "node",
  devtool: "source-map",
  entry: path.resolve(__dirname, "index.js"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "jieba",
    libraryTarget: "umd",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts"],
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [],
  },
  externals: {},
  plugins: [
    new BannerPlugin({
      entryOnly: false,
      banner: `${name} v${version}` + "\n" + `${description}` + "\n" + `Author: ${author}` + "\n" + `Date: ${new Date()}`,
    }),
  ],
};
