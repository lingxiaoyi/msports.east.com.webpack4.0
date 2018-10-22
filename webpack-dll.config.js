const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const dirVars = require('./webpack-config/base/dir-vars.config.js') // 与业务代码共用同一份路径的配置表
const CleanWebpackPlugin = require('clean-webpack-plugin')
var MiniCssExtractPlugin = require("mini-css-extract-plugin")
let ROOT_PATH = dirVars.srcRootDir
module.exports = {
    output: {
        path: dirVars.dllDir,
        filename: '[name].js',
        library: '[name]' // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    },
    entry: {
        /*
          指定需要打包的js模块
          或是css/less/图片/字体文件等资源，但注意要在module参数配置好相应的loader
        */
        dll: [ //外部不会改的库都放这里
            'n-zepto',
           /* 'zepto/src/deferred',
            'zepto/src/callbacks',
            'zepto/src/selector',
            'zepto/src/detect',
            'zepto/src/fx',
            'zepto/src/fx_methods',
            'zepto/src/touch',
            'zepto/src/gesture',*/
            'fastclick',
            'web-storage-cache',
            './src/public-resource/sass/database.scss',
            './src/public-resource/sass/common.scss'
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dll'],
            {
                root: ROOT_PATH, //根目录  此路径我试过用相对的全部失败  必须用绝对路径
                verbose: true, //开启在控制台输出信息
                dry: false //启用删除文件
            }),
        new webpack.DllPlugin({
            path: 'manifest.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            name: '[name]', // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
            context: dirVars.staticRootDir // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
        }),
        /* 跟业务代码一样，该兼容的还是得兼容 */
        new webpack.ProvidePlugin({
            $: 'n-zepto',
            Zepto: 'n-zepto',
            'window.Zepto': 'n-zepto',
            'window.$': 'n-zepto'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            //chunkFilename: "static/css/[id].css"
          }),
    ],
    module: require('./webpack-config/module.product.config.js'), // 沿用业务代码的module配置
    resolve: require('./webpack-config/resolve.config.js'), // 沿用业务代码的resolve配置
    mode: 'production'
}
