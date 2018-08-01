// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const autoprefixer = require('autoprefixer');

const paths = require('../config/paths');

module.exports = {
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      "@@components": `${paths.appSrc}/components`,
      "@@store": `${paths.appSrc}/store`,
      "@@views": `${paths.appSrc}/views`,
      "@@utils": `${paths.appSrc}/utils`
    },
  },
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('stylus-loader'),
          },
        ],
      },
    ],
  },
};
