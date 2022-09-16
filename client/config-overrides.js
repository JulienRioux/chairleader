/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const rewireStyledComponents = require('react-app-rewire-styled-components');

module.exports = function override(webpackConfig, env) {
  const fallback = webpackConfig.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    fs: false,
    process: false,
    path: false,
    zlib: false,
  });

  // Ignore source map warnings from node_modules.
  // See: https://github.com/facebook/create-react-app/pull/11752
  webpackConfig.ignoreWarnings = [/Failed to parse source map/];

  webpackConfig.resolve.fallback = fallback;
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  webpackConfig.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });
  webpackConfig = rewireStyledComponents(webpackConfig, env);
  return webpackConfig;
};
