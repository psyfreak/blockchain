const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const jquery = require("jquery");

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, "src/dapp")],
  mode: 'development',
  output: {
    path: path.join(__dirname, "prod/dapp"),
    filename: "bundle.js"
  },
  module: {
    rules: [
    {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.join(__dirname, "src/dapp/index.html"),
      title: 'My App',
      //filename: 'assets/admin.html'
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  resolve: {
    extensions: [".js"]

  },
  devServer: {
    //contentBase: path.join(__dirname, 'dist'),
    open: true,
    hot: true,
    port: 8000,
    static: {
      directory:path.join(__dirname, "dapp"),
      //contentBase:
    },
    devMiddleware: {
      stats: "minimal"
     /*
      index: true,
      mimeTypes: { "text/html": ["phtml"] },
      publicPath: "/publicPathForDevServe",
      serverSideRender: true,
      writeToDisk: true,

      */
    },
  }
};
