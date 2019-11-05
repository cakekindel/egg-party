const { HotModuleReplacementPlugin } = require('webpack');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    mode: 'development',
    devtool: 'inline-source-map',
    entry: ['./src/main.ts'],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: 'main.js',
    },
    watch: true,
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    plugins: [new HotModuleReplacementPlugin()],
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
};
