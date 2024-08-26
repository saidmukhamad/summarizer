// webpack.config.js
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/styles.css",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "styles.js",
  },
  module: { rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] }] },
  plugins: [new MiniCssExtractPlugin({ filename: "styles.css" })],
};

// postcss.config.js
module.exports = {
  plugins: [require("tailwindcss"), require("autoprefixer")],
};

// tailwind.config.js
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
