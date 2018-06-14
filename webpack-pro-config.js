const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const pkg = require("./package.json");

module.exports = {
  devtool: "cheap-module-source-map",
  // 关于选项的选择，http://cheng.logdown.com/posts/2016/03/25/679045
  // 具体请参考 https://webpack.js.org/configuration/devtool/#components/sidebar/sidebar.jsx
  target: "web",
  // https://webpack.js.org/configuration/target/

  entry: {
    vendor: ["react", "react-dom", "react-router-dom", "redux"],
    bundle: path.resolve(__dirname, "src/2-pages/app.js")
  },
  // https://webpack.js.org/configuration/entry-context/
  output: {
    path: path.join(__dirname, "dist"),
    // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它

    publicPath: "http://h5-file-dev.oss-cn-hangzhou.aliyuncs.com/appc/collage/frontend/",
    // 模板、样式、脚本、图片等资源对应的server上的路径

    filename: "bundle.[hash:5].js"
    // 命名生成的JS
  },
  // https://webpack.js.org/configuration/output/
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(eot|svg|ttf|woff).*$/,
        loader: "url-loader",
        options: {
          limit: 15000
        }
      },
      {
        test: /\.(gif|jpe?g|png|ico).*$/,
        loader: "url-loader",
        options: {
          limit: 15000
        }
      },
      /* 针对antd less 样式的处理 */
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          { loader: "less-loader", options: { modifyVars: pkg.theme } }
        ],
        include: /node_modules/
      },
      /* 公有样式 */
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader", options: { sourceMap: true } },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ],
        include: path.resolve(__dirname, "src/3-static")
      },
      /* 私有样式，模块化处理 */
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader", options: { sourceMap: true } },
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ],
        include: path.resolve(__dirname, "src/js")
      }
    ]
  },
  // 引入外部库
  // 适用于一些常用且体积较大的库，充分利用CDN加速，减轻服务器负担，降低加载时间！
  // https://webpack.js.org/configuration/externals/
  externals: {
    moment: true,
    wx: true,
    flex: true,
    uuid: true
  },

  resolve: {
    modules: [path.resolve("./node_modules"), path.resolve(__dirname, "src")],
    // 这样，webpack在查找模块时，先查找 node_modules ，如果没找到则在 src 中查找

    extensions: [".web.js", ".js", ".json"],
    // 该配置项将不再要求强制转入一个空字符串，而被改动到了resolve.enforceExtension下
    // 相关文档 https://webpack.js.org/configuration/resolve/
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"',
      __DEV__: false
    }),
    // 很多库的内部，有process.NODE_ENV的判断语句，
    // 改为production。最直观的就是没有所有的debug相关的东西，体积会减少很多

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.optimize.UglifyJsPlugin(),
    // 代码压缩
    // https://webpack.js.org/guides/migrating/#uglifyjsplugin-sourcemap

    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      // 指定入口文件(entry)哪个key需要提取，提取公用的，更新率低的部分。

      filename: "vendor.min.js",
      // (Give the chunk a different name) 此项如果省略默认生成 vendor.js

      minChunks: Infinity
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }),
    // https://webpack.js.org/plugins/commons-chunk-plugin/#components/sidebar/sidebar.jsx
    // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk

    new HtmlWebpackPlugin({
      // Create HTML file that includes references to bundled CSS and JS.
      template: "src/index.html",
      title: "嘟嘟商学院",
      hash: true,
      // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
      // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更新！
      inject: "body",
      minify: {
        removeComments: true,
        // 移除HTML中的注释

        collapseWhitespace: true,
        // 删除空白符与换行符

        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ]
};
