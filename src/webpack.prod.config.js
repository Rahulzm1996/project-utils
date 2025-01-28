// const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackPwaManifest = require('webpack-pwa-manifest');
// const CompressionPlugin = require('compression-webpack-plugin');
// const SentryWebpackPlugin = require('@sentry/webpack-plugin');
// const { execSync } = require('child_process');
// const dotenv = require('dotenv');
// const TerserPlugin = require('terser-webpack-plugin');
// const { EsbuildPlugin } = require('esbuild-loader');
// const pjson = require('./package.json');
// const { baseConfig } = require('./webpack.base.config');

// const env = dotenv.config().parsed;
// const latestCommitHash = execSync('git rev-parse HEAD').toString().trim();

// const config = baseConfig({
//   mode: 'production',

//   // In production, we skip all hot-reloading stuff
//   entry: [path.join(process.cwd(), 'app/app.js')],

//   // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
//   output: {
//     filename: '[name].[chunkhash].js',
//     chunkFilename: '[name].[chunkhash].chunk.js'
//   },

//   tsLoaders: [
//     { loader: 'babel-loader' }, // using babel after typescript transpiles to target es6
//     {
//       loader: 'ts-loader',
//       options: {
//         transpileOnly: true, // fork-ts-checker-webpack-plugin is used for type checking
//         logLevel: 'info'
//       }
//     }
//   ],
//   stats: {
//     // Display bailout reasons
//     optimizationBailout: true
//   },
//   optimization: {
//     // usedExports: true,
//     // sideEffects: false, // if necessary, depending on package
//     minimize: true,
//     moduleIds: 'hashed',
//     minimizer: [
//       new EsbuildPlugin({
//         target: 'es2015', // Syntax to compile
//         css: true
//       })
//     ],
//     nodeEnv: 'production',
//     // sideEffects: true,
//     concatenateModules: true,
//     splitChunks: {
//       maxInitialRequests: 30,
//       maxAsyncRequests: 30,
//       chunks: 'all',
//       // maxSize: 0,
//       minSize: 20000, // Minimum size, in bytes, for a chunk to be generated
//       maxSize: 0, // No maximum size
//       minChunks: 1, // Minimum number of chunks that must share a module before splitting
//       cacheGroups: {
//         default: {
//           minChunks: 2,
//           priority: -20,
//           chunks: 'all',
//           reuseExistingChunk: true
//         },

//         route: {
//           test: /[\\/]app[\\/]containers[\\/]([^\\/]+)[\\/]Loadable\.js$/, // Dynamic match for container names
//           name(module) {
//             const routeName = module.context.match(/[\\/]app[\\/]containers[\\/](.*?)([\\/]|$)/)[1];
//             return `route.${routeName}`;
//           },
//           chunks: 'all',
//           priority: -10
//         }
//       }
//     }
//   },

//   plugins: [
//     new HtmlWebpackPlugin({
//       template: 'app/index.html',
//       minify: {
//         removeComments: true,
//         collapseWhitespace: true,
//         removeRedundantAttributes: true,
//         useShortDoctype: true,
//         removeEmptyAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         keepClosingSlash: true,
//         minifyJS: true,
//         minifyCSS: true,
//         minifyURLs: true
//       },
//       inject: true
//     }),

//     new CompressionPlugin({
//       algorithm: 'gzip',
//       test: /\.js$|\.css$|\.html$/,
//       threshold: 10240,
//       minRatio: 0.8
//     }),

//     new WebpackPwaManifest({
//       name: 'Unified Dashboard',
//       short_name: 'Unified',
//       description: 'My Unified Dashboard project!',
//       background_color: '#fafafa',
//       theme_color: '#0f72ee',
//       inject: true,
//       ios: true,
//       icons: [
//         {
//           src: path.resolve('app/images/mainLogo.svg'),
//           sizes: [72, 96, 128, 144, 192, 384, 512]
//         },
//         {
//           src: path.resolve('app/images/mainLogo.svg'),
//           sizes: [120, 152, 167, 180],
//           ios: true
//         }
//       ]
//     }),
//     // upload source maps
//     new SentryWebpackPlugin({
//       // sentry-cli configuration
//       authToken: env.REACT_APP_SENTRY_TOKEN,
//       org: 'chatteron',
//       project: 'unified-dashboard',
//       release: pjson.version,
//       include: './dist',
//       ignore: ['node_modules', 'webpack.config.js'],
//       setCommits: {
//         repo: 'chatteron/unified-dashboard',
//         commit: latestCommitHash
//       }
//     }),
//     {
//       apply: compiler => {
//         compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
//           // Code for uploading Source Maps to Sentry
//           // console.log(
//           //   'Uploading Source Maps to Sentry',
//           //   `node ${path.resolve(process.cwd(), 'uploadSourcemaps.js')}`
//           // );
//           // execSync(`node ${path.resolve(process.cwd(), 'uploadSourcemaps.js')}`, {
//           //   stdio: 'inherit'
//           // });
//         });
//       }
//     }
//   ],

//   devtool: 'source-map',

//   performance: {
//     assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
//   }
// });
// module.exports = config;
