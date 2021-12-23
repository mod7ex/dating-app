const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
      mode: "development",

      entry: path.resolve(__dirname, "src", "js", "main.js"),
      output: {
            path: path.resolve(__dirname, "public"),
            filename: "[name].js",
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
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                              loader: "babel-loader",
                        },
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

      devtool: false,

      target: "node",

      externals: {
            bufferutil: "bufferutil",
            "utf-8-validate": "utf-8-validate",
      },
};
