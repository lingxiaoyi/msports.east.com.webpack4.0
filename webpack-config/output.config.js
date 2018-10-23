const dirVars = require('./base/dir-vars.config.js')
const isOnlinepro = process.argv.indexOf('--env=onlinepro') !== -1 //判断参数如果有这个就是生产环境 API_ROOT值就为cdn地址
const isTestpro = process.argv.indexOf('--env=testpro') !== -1
let rootPath = ''
let outPath = ''
if (isOnlinepro) {
    rootPath = '//msports.eastday.com/h5/'
    outPath = dirVars.buildOnline
} else if (isTestpro) {
    rootPath = '//test-msports.dftoutiao.com/msports.east.com.webpack4.0/build/'
    outPath = dirVars.buildDir
} else {
    rootPath = '/'
    outPath = dirVars.buildDir
}
module.exports = { ///entry
    path: outPath,
    publicPath: rootPath,
    filename: 'static2/js/[name].js', // [name]表示entry每一项中的key，用以批量指定生成后文件的名称[name].[chunkhash].js
    //chunkFilename: 'static/js/[id].[chunkhash].bundle.js'
}
