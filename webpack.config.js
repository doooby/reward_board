const path = require('path');

const Config = require('webpack-chain');

const config = new Config();

const env = process.env.NODE_ENV === 'production' ? process.env.NODE_ENV : 'development';

config.mode(env);
// config.devtool('eval-cheap-module-source-map');

config.resolve.extensions
    .add('.js')
    .add('.ts')
    .add('.tsx');

config.module.rule('typescript')
    .test(/\.tsx?$/)
    .use('ts').loader(require.resolve('ts-loader')).end();

module.exports = config;

config.entry('reward_board').add('./src/index.tsx');
config.entry('demo').add('./demo/index.js');
config.entry('demo_server_helpers').add('./demo/lib/server_helpers.js');
config.output.path(path.resolve(__dirname, 'tmp/build'));

module.exports = config.toConfig();
