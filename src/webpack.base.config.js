/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const deps = require("./package.json").dependencies;

module.exports = {
  path,
  webpack,
  dotenv,
  CopyWebpackPlugin,
};

// Load environment variables
dotenv.config();
const MFE_REMOTE_GLOBAL_SETTINGS_URL = (() => {
  if (process.env.MFE_REMOTE_GLOBAL_SETTINGS_URL)
    return process.env.MFE_REMOTE_GLOBAL_SETTINGS_URL;
  console.log(
    "No entry for remote global settings MFE in .env file. Please add entry to .env"
  );
  process.exit(-1);
})();

/**
 * Base Webpack config that will be used for dev & prod builds
 */
module.exports.baseConfig = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: {
    // Compile into js/build.js
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/",
    ...options.output,
  }, // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: options.babelQuery,
        },
      },
      {
        test: /\.ts(x?)$/, // Transform typescript files with ts-loader
        exclude: /node_modules|\.d\.ts$/,
        use: options.tsLoaders,
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: "asset/resource",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                enabled: false,
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed),
    }),
    new CopyWebpackPlugin([
      {
        from: "./node_modules/@pdftron/webviewer/public",
        to: "./webviewer/lib",
      },
    ]),
    // Since webpack 5 will not include `process` by default, we need to set the process via process/browser module
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.container.ModuleFederationPlugin({
      name: "mainApp",
      remotes: {
        globalSettings: `globalSettings@${MFE_REMOTE_GLOBAL_SETTINGS_URL}`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
  ]),
  resolve: {
    modules: ["node_modules", "app"],
    extensions: [".js", ".jsx", ".react.js", ".ts", ".tsx"],
    mainFields: ["browser", "module", "jsnext:main", "main"],
    // fallback are needed to add node js modules. Webpack 4 used to auto add node modules hence it was not required to explicitly
    // add them but now with webpack 5 it is required to explicitly add them.
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      "process/browser": require.resolve("process/browser"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert"),
      util: require.resolve("util"),
      domain: require.resolve("domain-browser"),
      vm: require.resolve("vm-browserify"),
    },
  },
  devtool: options.devtool,
  target: "web", // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  devServer: options.devServer || {},
  stats: options.stats || {},
});
