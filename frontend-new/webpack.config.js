const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      fs: false, // Often used for file operations in Node.js, not usually needed in the browser unless specifically used in code
      path: require.resolve('path-browserify'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('stream-http'), // Assuming https might also be needed
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'), // Buffer might also be needed
      stream: require.resolve('stream-browserify'),
      querystring: require.resolve('querystring-es3'),
      async_hooks: require.resolve('async_hooks-browserify') // Assuming you find a browserify version for async_hooks if needed
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  ]
};
