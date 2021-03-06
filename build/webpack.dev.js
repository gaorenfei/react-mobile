const path = require("path");
const config = require("./config");
const commonConfig = require("./webpack.common.js");
const merge = require("webpack-merge");
const webpack = require("webpack");
const OpenBrowserPlugin = require("open-browser-webpack-plugin"); // 打开浏览器
const px2rem = require("postcss-px2rem-exclude")

let postcssLoader = { 
  loader:"postcss-loader", options:{
  ident:"postcss",
  plugins:()=>[
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer:{
        flexbox:"no-2009"
      },
      stage:3
    }),
    px2rem({ remUnit: 75, exclude: /node_modules/ })
  ]
}}

module.exports = (env, argv) =>
  merge(commonConfig(env, argv), {
    mode: "development",
    devtool: "inline-source-map", // 可在浏览器控制台调试源码,不过会减慢打包速度
    devServer: {
      contentBase: path.join(__dirname, "../dist"), // 从哪提供内容
      historyApiFallback: true,// 所有的路由请求都定向到根目录
      inline: true,
      hotOnly: true,
      port: config.port,
      publicPath: config.publicPath,
      noInfo: false,
      // https:true,
      disableHostCheck: true, //  用于解决反向代理Host检察问题
      proxy: {
          "*": {
              target: "",
              secure: false,
              changeOrigin: true
          }
      }
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),  // 模块热更新插件
      new OpenBrowserPlugin({ url: config.url })
    ],
    module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                "style-loader",
                "css-loader",
                postcssLoader
            ]
          },
          {
              test: /\.less/,
              use: [
                  { loader: "style-loader" },
                  { loader: "css-loader" },
                  postcssLoader,
                  { loader: "less-loader",
                    options: {
                      javascriptEnabled: true
                    }
                  }
              ]
          },
          {
              test: /\.(js|jsx)$/,
              use: ["babel-loader"],
              include: config.srcPath,
              exclude: /node_modules/
          }
      ]
    }
  });
