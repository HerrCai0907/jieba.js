const path = require("path");
const { BannerPlugin } = require("webpack");
const { version, author, description, name } = require("./package.json");

module.exports = {
  mode: "development",
  target: "node",
  entry: path.resolve(__dirname, "index.ts"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
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
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  externals: {},
  plugins: [
    new BannerPlugin({
      entryOnly: false,
      banner:
        `${name} v${version}` +
        "\n" +
        `${description}` +
        "\n" +
        `Author: ${author.join(" ")}` +
        "\n" +
        `Date: ${new Date()}`,
    }),
  ],
};
