const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "js/[name].[contenthash:8].js" : "js/[name].js",
      publicPath: "/",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    devtool: isProd ? false : "eval-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: /\.module\.css$/,
                  localIdentName: isProd ? "[hash:base64:6]" : "[name]__[local]",
                  namedExport: false,
                  exportLocalsConvention: "as-is",
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          resourceQuery: /react/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "preset-default",
                      params: { overrides: { removeViewBox: false } },
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(svg|png|jpe?g|webp|woff2?)$/,
          resourceQuery: { not: [/react/] },
          type: "asset",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
        }),
    ].filter(Boolean),
    devServer: {
      port: 3000,
      open: false,
      hot: true,
      historyApiFallback: true,
    },
    performance: { hints: false },
  };
};
