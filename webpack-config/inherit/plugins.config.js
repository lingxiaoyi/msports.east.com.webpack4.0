let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let path = require('path')
let dirlets = require('../base/dir-vars.config.js')
let pageArr = require('../base/page-entries.config.js')
let HashOutput = require('webpack-plugin-hash-output')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
//const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin')
const isOnlinepro = process.argv.indexOf('--env=onlinepro') !== -1

const devServer = process.argv.join('').indexOf('webpack-dev-server') !== -1 //有这个参数就生成html模板
let configPlugins = [
    /* 全局shimming */
    new webpack.ProvidePlugin({
        $: 'n-zepto',
        Zepto: 'n-zepto',
        'window.Zepto': 'n-zepto',
        'window.$': 'n-zepto',
        WebStorageCache: 'web-storage-cache',
        Vue: 'vue',
        vue: 'vue'
    }),
    /* 抽取出所有通用的部分 */
    new webpack.optimize.SplitChunksPlugin({
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '-',
        name: true,
        cacheGroups: {
            commons: {
                name: 'commons',
                chunks: 'all',
                minChunks: 8,
                maxInitialRequests: 5,
                minSize: 0
            },
        }
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].css', //.[contenthash]
        //chunkFilename: "static/css/[id].css"
      }),
    /* 配置好Dll */
    new webpack.DllReferencePlugin({
        context: dirlets.staticRootDir, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
        manifest: require('../../manifest.json'), // 指定manifest.json
        name: 'dll' // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    }),
    new HashOutput({
        manifestFiles: 'manifest' // 指定包含 manifest 在内的 chunk
    })
]

pageArr.forEach((page) => {
    let filename = ''
    /*if (!devServer) {
        if (page === 'detail' || page === 'detail-baijiahao' || page === 'liveing' || page === 'video' || page === 'atlas') {
            if (isOnlinepro) {
                filename += `../vm/online/${page}.vm`
            } else {
                filename += `../vm/test/${page}.vm`
            }
        } else if (page === 'news_content.html') {
            filename += `html/${page}.php`
        } else {
            filename += `html/${page}.html`
        }
        //filename = `html/${page}.html`
    } else {}*/
    if (page === 'index') {
        if (isOnlinepro) {
            filename += `html/${page}2.html`
        } else {
            filename += `html/${page}.html`
        }
    } else {
        filename += `html/${page}.html`
    }
    const htmlPlugin = new HtmlWebpackPlugin({
        filename: `${filename}`, //vm文件和html文件分开
        template: path.resolve(dirlets.pagesDir, `./${page}/html.js`),
        chunks: ['manifest', page, 'commons'],
        hash: false, // 为静态资源生成hash值
        xhtml: false, //是否渲染link为自闭合的标签，true则为自闭合标签
        minify: false
    })
    configPlugins.push(htmlPlugin)
})

module.exports = configPlugins
