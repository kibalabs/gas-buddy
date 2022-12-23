/* eslint-disable */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const htmlTemplateFilePath = path.join(__dirname, './index.html');

module.exports = (config) => {
  config.addHtmlOutput = false;
  config.webpackConfigModifier = (webpackConfig) => {
    webpackConfig.entry = {
      'main': webpackConfig.entry,
      'foreground': './src/foreground.tsx',
      'background': './src/background.ts',
    };
    // NOTE(krishan711): cant use optimize because otherwise the background and foreground are not importable (they get wrapped in a function)
    webpackConfig.optimization = {
      ...webpackConfig.optimization,
      runtimeChunk: undefined,
      usedExports: undefined,
      moduleIds: undefined,
      splitChunks: undefined,
    };
    webpackConfig.output.filename = '[name].js';
    webpackConfig.plugins = [
      ...webpackConfig.plugins,
      new HtmlWebpackPlugin({
        inject: true,
        template: htmlTemplateFilePath,
        excludeChunks: ['foreground', 'background'],
      }),
    ]
    return webpackConfig;
  }
  return config;
};
