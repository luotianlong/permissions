const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// hash类型，生产环境使用chunkhash
var hashType = '';
if (process.env.NODE_ENV === 'production') {
    hashType = '[chunkhash:8]';
}else {
    hashType = '';
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'js/[name].build.js?' + hashType
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // loaders: {
                    //     sass : ExtractTextPlugin.extract({
                    //         fallback: 'vue-style-loader',
                    //         use: ['style-loader','css-loader','sass-loader','postcss-loader']
                    //     })
                    // },
                    sass: ['style-loader','css-loader','sass-loader','postcss-loader'],
                    postcss: [autoprefixer({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })],
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]?[hash:8]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/i,
                loader: "file-loader",
                options: {
                    name: 'font/[name].[ext]?[hash:8]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'images': path.resolve(__dirname, './src/images'),
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        host: '192.168.6.94' // 配置ip
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins: [
        // 自动生成html文件
        new htmlWebpackPlugin({
            filename: '../views/index.html',
            template: 'views_dev/index.html',
            favicon: 'favicon.ico',
        }),
        // 把.vue文件里的样式单独提出来 rules里也需要一些配置
        // new ExtractTextPlugin({
        //     filename: 'css/[name].css?[contenthash:8]',
        //     allChunks: true,
        // })
        new CopyWebpackPlugin([{
            from: __dirname + '/src/public',
            to: __dirname + '/dist'
        }])
    ],
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
