const { HotModuleReplacementPlugin } = require('webpack');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    mode: 'production',
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
        path: join(process.cwd(), 'dist'),
        filename: 'main.js',
    },
    entry: ['./src/main.ts'],
    plugins: [new HotModuleReplacementPlugin()],
    externals: [
        nodeExternals(),
    ],
};
