const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const pkg = require("./package.json");

module.exports = {
  devtool: "cheap-module-eval-source-map",
  // 关于选项的选择，http://cheng.logdown.com/posts/2016/03/25/679045
  // 具体请参考 https://webpack.js.org/configuration/devtool/#components/sidebar/sidebar.jsx

  context: path.resolve(__dirname, "src"),
  // 指定资源读取的根目录
  // https://webpack.js.org/configuration/entry-context/#components/sidebar/sidebar.jsx

  target: "web",
  // https://webpack.js.org/configuration/target/

  entry: ["react-hot-loader/patch", "./2-pages/app.js"],
  // https://webpack.js.org/configuration/entry-context/
  output: {
    path: path.join(__dirname, "dist"),
    // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它

    publicPath: "/",
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
      "process.env.NODE_ENV": JSON.stringify("development"),
      __DEV__: true
    }),
    // 很多库的内部，有process.NODE_ENV的判断语句，
    // 改为production。最直观的就是没有所有的debug相关的东西，体积会减少很多

    new webpack.HotModuleReplacementPlugin(),
    // 启用热替换,仅开发模式需要

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // 允许错误不打断程序，,仅开发模式需要

    new HtmlWebpackPlugin({
      title: "开发模式",

      filename: "index.html",
      // 文件名以及文件将要存放的位置

      favicon: "favicon.ico",
      // favicon路径

      template: "index.html",
      // html模板的路径

      inject: "body"
      // js插入的位置，true/'head'  false/'body'
    })
  ]
};
