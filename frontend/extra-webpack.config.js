const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      global: require.resolve('globals'),
      process: 'process/browser', // This npm package can emulate global Node variables
    })
  ],
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "querystring": require.resolve("querystring-es3"),
        "crypto": require.resolve("crypto-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "http": require.resolve("stream-http"),
        "url": require.resolve("url/"),
        "fs": false,
      "net": false,
      "assert": false,
      "util": require.resolve("util/"),
      }
    }
  };
  