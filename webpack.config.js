const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Config = require('webpack-chain');

const config = new Config();

config.mode('development');
config.devtool('eval-cheap-module-source-map');

config.resolve.extensions
    .add('.js')
    .add('.ts')
    .add('.tsx')
    .add('.scss');

config.module.rule('typescript')
    .test(/\.tsx?$/)
    .use('ts').loader(require.resolve('ts-loader')).end();

config.module.rule('sass')
    .test(/\.scss$/)
    .use('MiniCssExtractPlugin').loader(MiniCssExtractPlugin.loader).end()
    .use('css').loader('css-loader?url=false').end()
    .use('sass').loader('sass-loader').end();

config.plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin);

module.exports = config;

config.entry('app').add(`./src/index.ts`);
config.output.path(path.resolve(__dirname, 'tmp/build'));

module.exports = config.toConfig();
