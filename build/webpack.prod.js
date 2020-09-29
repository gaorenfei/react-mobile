const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩css代码
const HappyPack = require("happypack"); //多线程运行
const CleanWebpackPlugin = require("clean-webpack-plugin"); //每次打打包清除上次打包内容
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css单独打包
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");  //将dll文件引入html
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin"); //多线程压缩
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer") // 打包后显示打包文件细节
    .BundleAnalyzerPlugin;
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin") // 为模块提供中间缓存，提升第二次打包构建速度可以替换DLL插件
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); //分析各个loader编译时间和add插件有冲突
// const smp = new SpeedMeasurePlugin();
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
    mode: "production",
    devtool: "source-map", // 生产环境可在浏览器上调试源码，不建议，这样会暴露源码。可设置为none
    module: {
      rules: [
          {
              test: /\.css$/,
              use: [MiniCssExtractPlugin.loader, "css-loader", postcssLoader]
          },
          {
            test: /\.less/,
            use: [
                MiniCssExtractPlugin.loader,
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
              // loader: "happypack/loader?id=babel",
              loader: "babel-loader?cacheDirectory=true",// babel缓存开启 极大提高打包速度
              include: path.join(__dirname, "../src"),
              exclude: /node_modules/
          }
      ]
    },
    plugins: [
        new CleanWebpackPlugin(path.join(__dirname, "../dist"), {
          root: path.join(__dirname, "../")
        }),
        new BundleAnalyzerPlugin(), // 打包后显示打包文件细节
        new HappyPack({
          //多线程运行 默认是电脑核数-1
          id: "babel", //对于loaders id
          loaders: ["babel-loader"], //是用babel-loader解析
          threadPool: HappyPack.ThreadPool({ size: 4 }),
          verboseWhenProfiling: true //显示信息
        }),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[name].chunk.css"
        }),
        new AddAssetHtmlWebpackPlugin({ //将dll文件引入html
          filepath: path.resolve(__dirname, "../dll/vendor.dll.js")
        }),
        new webpack.DllReferencePlugin({ //webpack打包时根据manifest.json文件,排除不需要打包处理的第三方依赖文件
          manifest: path.resolve(__dirname, "../dll/manifest.json")
        })
    ],
    optimization: {
      usedExports: true, // tree shaking  package.json中也做了css排除配置
      splitChunks: {
        chunks: "all",
        minSize: 30000, // 3 to 10 because of gzip
        minChunks: 2, // 共享该module的最小chunk数
        maxAsyncRequests: 10,
        maxInitialRequests: 3,
        automaticNameDelimiter: "-",
        name: true,
        cacheGroups: {
          default: {
              name: "common",
              chunks: "initial",
              minChunks: 2,  //模块被引用2次以上的才抽离
              priority: -20
          },
          vendors: {  //拆分第三方库
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              chunks: "initial",
              priority: -10
          }
        }
      },
      minimizer: [
        new OptimizeCSSAssetsPlugin(),   // 压缩css代码，去掉空格这些，在安装在生产环境下
        new ParallelUglifyPlugin({
            cacheDir: ".cache/",
            uglifyJS:{
              output: {
                //是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为false
                beautify: false,
                //是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
                comments: false
              },
              compress: {
              //是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
                drop_console: true,
              //是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 1, 默认为否
                collapse_vars: true
              }
            }
        })
      ]
    }
  });
// module.exports = smp.wrap(prodConfig)