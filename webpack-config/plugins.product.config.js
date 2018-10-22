const webpack = require('webpack')
let pluginsConfig = require('./inherit/plugins.config.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
let dirlets = require('./base/dir-vars.config.js')
let ROOT_PATH = dirlets.staticRootDir
const isOnlinepro = process.argv.indexOf('--env=onlinepro') !== -1
const isTestpro = process.argv.indexOf('--env=testpro') !== -1
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')

pluginsConfig.push(new webpack.DefinePlugin({
    IS_PRODUCTION: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
    isOnlinepro,
    isTestpro
}))

pluginsConfig.push(new webpack.NoEmitOnErrorsPlugin()) // 配合CLI的--bail，一出error就终止webpack的编译进程

/* HashedModuleIdsPlugin 这个插件，他是根据模块的相对路径生成一个长度只有四位的字符串作为模块的 module id ，
这样就算引入了新的模块，也不会影响 module id 的值，只要模块的路径不改变的话。 */
pluginsConfig.push(new webpack.HashedModuleIdsPlugin())

module.exports = pluginsConfig
