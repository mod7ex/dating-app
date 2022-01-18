const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
      mode: "development",

      entry: path.resolve(__dirname, "src", "js", "main.js"),
      output: {
            path: path.resolve(__dirname, "public"),
            filename: "[name].js",
            assetModuleFilename: "[name][ext][query]",
      },

      plugins: [
            new CleanWebpackPlugin(),

            new MiniCssExtractPlugin({
                  filename: "[name].css",
                  linkType: "text/css",
            }),
      ],

      module: {
            rules: [
                  {
                        test: /\.(png|jpe?g|gif|svg|ico)$/i,
                        type: "asset/resource",
                  },

                  {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                              loader: "babel-loader",
                        },
                  },

                  {
                        test: /\.js$/,
                        loader: "webpack-remove-debug", // remove "debug" package
                  },

                  {
                        test: /\.(s[ac]|c)ss$/i,
                        use: [
                              {
                                    loader: MiniCssExtractPlugin.loader,
                                    options: {
                                          publicPath: path.resolve(
                                                __dirname,
                                                "public",
                                                "css"
                                          ),
                                    },
                              },

                              "css-loader",

                              "postcss-loader",

                              "sass-loader",
                        ],
                  },
            ],
      },

      devtool: "source-map",

      target: "node",

      externals: {
            bufferutil: "bufferutil",
            "utf-8-validate": "utf-8-validate",
      },
};
