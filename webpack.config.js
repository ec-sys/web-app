const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue?$/,
                exclude: /(node_modules)/,
                use: 'vue-loader'
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new webpack.ProvidePlugin({
            commonConstants: path.resolve(path.join(__dirname, 'src/_constants/common.constant.js')),
            commonUtils: path.resolve(path.join(__dirname, 'src/_utils/common.utils.js')),
            stringUtils: path.resolve(path.join(__dirname, 'src/_utils/string.utils.js')),
            config: path.resolve(path.join(__dirname, 'src/config.js'))
        }),
    ],
    devServer: {
        port:4000,
        historyApiFallback: true
    },
    externals: {}
}
