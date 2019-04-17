const path = require("path");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const LoadablePlugin = require("@loadable/webpack-plugin");
const baseWebpackConfig = require("./webpack.config.base");
const util = require("./util");

const isProd = process.env.NODE_ENV === "production";

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: "./src/entry-client.tsx"
  },
  output: {
    filename: "static/js/[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              plugins: [
                "@loadable/babel-plugin"
              ]
            }
          },
          {
            loader: "ts-loader",
            options: {
              // 支持HMR和禁用类型检查，类型检查将使用ForkTsCheckerWebpackPlugin
              transpileOnly: true  
            }
          },
          {
            loader: "eslint-loader"
          }
        ],
        exclude: /node_modules/
      },
      ...util.styleLoaders({
        sourceMap: false,
        usePostCSS: true,
        extract: isProd ? true : false
      })
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",  // chunk选择范围
      cacheGroups: {
        vendor: {
          test: function(module) {
            // 阻止.css文件资源打包到vendor chunk中
            if(module.resource && /\.css$/.test(module.resource)) {
              return false;
            }
            // node_modules目录下的模块打包到vendor chunk中
            return module.context && module.context.includes("node_modules");
          }
        }
      }
    },
    // webpack引导模块
    runtimeChunk: {
      name: "manifest"
    }
  },
  plugins: [
    // 在单独的进程中执行类型检查加快编译速度
    new ForkTsCheckerWebpackPlugin({
      async: false,
      tsconfig: path.resolve(__dirname, "../tsconfig.json")
    }),
    new LoadablePlugin({
      filename: "client-manifest.json",
    })
  ]
});

if (isProd) {
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css"
    })
  );
}

module.exports = webpackConfig;
