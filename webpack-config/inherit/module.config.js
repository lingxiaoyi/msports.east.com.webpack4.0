let dirVars = require('../base/dir-vars.config.js')
let eslintFormatter = require('eslint-friendly-formatter')
let path = require('path')

module.exports = {
    rules: [
        /*{
          test: /\.js$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          include: dirVars.srcRootDir,
          exclude: /bootstrap/,
          options: {
            formatter: eslintFormatter,
            fix: true,
            configFile: path.resolve(dirVars.staticRootDir, './.eslintrc.js'),
            failOnWarning: true,
            failOnError: true,
            cache: true,
          }
        },*/
        /*{
            test: require.resolve('zepto'),
            loader: 'exports-loader?window.Zepto!script-loader!exports-loader?window.$!script-loader'
        },*/
        {
            test: require.resolve('n-zepto'),
            loader: 'expose-loader?$!expose-loader?Zepto', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`    这样就可以用$的全局插件了  直接script引用
        },
        {
            test: /\.js$/,
            include: dirVars.srcRootDir,
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    "targets": {
                      "browsers": ["last 10 versions"]
                    },
                    //"useBuiltIns": 'usage',
                    "modules": "commonjs"
                  }
                ]
              ],
              cacheDirectory: true,
              plugins: [
                '@babel/plugin-transform-runtime', "@babel/plugin-transform-object-assign"
              ]
            }
          },
        {
            test: /\.html$/,
            include: dirVars.srcRootDir,
            loader: 'html-loader'
        },
        {
            test: /\.ejs$/,
            include: dirVars.srcRootDir,
            loader: 'ejs-loader'
        },
        {
            // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            // 如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            include: dirVars.srcRootDir,
            // loader: 'url-loader?limit=8192&name=./static/img/[hash].[ext]',
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: './static/img/[hash].[ext]'
            }
        },
        {
            // 专供bootstrap方案使用的，忽略bootstrap自带的字体文件
            test: /\.(woff|woff2|svg|eot|ttf)$/,
            include: /glyphicons/,
            loader: 'null-loader'
        },
        {
            // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
            test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
            include: dirVars.srcRootDir,
            // exclude: /glyphicons/,
            // loader: 'file-loader?name=static/fonts/[name].[ext]',
            loader: 'file-loader',
            options: {
                name: 'static/fonts/[name].[hash].[ext]'
            }
        },
    ]
}
