const dirVars = require('./base/dir-vars.config.js')
let moduleConfig = require('./inherit/module.config.js')

/*
  由于ExtractTextPlugin不支持热更新，因此选择在开发环境下直接用style-loader加载样式。
  如有问题，可切换回ExtractTextPlugin，即使不能用热更新，也可实现LiveReload
*/
moduleConfig.rules.push({
    test: /\.css$/,
    exclude: /node_modules|bootstrap/,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader'
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins: (loader) => [
                    require('precss'),
                    require('autoprefixer')({
                        broswers: [
                            'last 10 versions'
                        ]
                    })
                ]
            }
        }
    ]
})

moduleConfig.rules.push({
    test: /\.css$/,
    include: /bootstrap/,
    use: [
        'style-loader', 'css-loader'
    ]
})

moduleConfig.rules.push({
    test: /\.scss$/,
    include: dirVars.srcRootDir,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
            /*options: {
                sourceMap: true
            }*/
        },
        {
            loader: 'postcss-loader',
            options: {
                /*sourceMap: true,*/
                plugins: (loader) => [
                    require('precss'),
                    require('autoprefixer')({
                        broswers: [
                            'last 10 versions'
                        ]
                    })
                ]
            }
        }, {
            loader: 'sass-loader',
            /*options: {
                sourceMap: true
            } */// 将 Sass 编译成 CSS
        }
    ]
})

/*moduleConfig.rules.push({
    test: require.resolve(dirVars.vendorDir, 'jquery.min'), // 此loader配置项的目标是NPM中的jquery
    loader: 'expose?$!expose?jQuery',
})*/
module.exports = moduleConfig
