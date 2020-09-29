const path = require("path");
const config = require("./config");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //HTML模板
const DotenvFlow = require("dotenv-flow-webpack"); //配置env文件

module.exports = () => {
  return {
    entry: {
      main: path.join(__dirname, "../src/main.jsx")
    },
    output: {
      chunkFilename: "[name].[contenthash:6].js", // 按需加载文件名称
      filename: "app.js", // 打包后文件名为app.js
      path: path.resolve(__dirname, "../dist"), //打包后的文件资源在dist文件下
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: "url-loader?limit=10000&name=images/[hash:8].[name].[ext]"
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: "url-loader?limit=10000&name=media/[hash:8].[name].[ext]"
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: "url-loader?limit=10000&name=font/[hash:8].[name].[ext]"
        },
        {
          test: /\.(js|jsx)$/,
          enforce: "pre",
          use: [{
            loader: "eslint-loader",
            options: { // 指定错误报告的格式规范
              formatter: require("eslint-friendly-formatter")
            }
          }],
          include: config.srcPath,
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
      alias: { // 引入模块别名
        "@": `${config.srcPath}`,
        actions: `${config.srcPath}/actions`,
        stores: `${config.srcPath}/stores`,
        pages: `${config.srcPath}/pages/`,
        util: `${config.srcPath}/util/`,
        styles: `${config.srcPath}/styles/`
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "../index.html"), //样板
        inject: "body", //注入到哪里
        chunksSortMode: "none",
        hash: true
      }),
      new DotenvFlow(),
      //全局变量
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
    ]
  }
}