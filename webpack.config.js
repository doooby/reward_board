const path = require('path');

const Config = require('webpack-chain');

const config = new Config();

// config.mode('production');
config.mode('development');
// config.devtool('eval-cheap-module-source-map');

config.resolve.extensions
    .add('.js')
    .add('.ts')
    .add('.tsx');

config.module.rule('typescript')
    .test(/\.tsx?$/)
    .use('ts').loader(require.resolve('ts-loader')).end();

module.exports = config;

config.entry('app').add('./src/index.tsx');
config.entry('demo').add('./demo/index.js');
config.output.path(path.resolve(__dirname, 'tmp/build'));

module.exports = config.toConfig();
