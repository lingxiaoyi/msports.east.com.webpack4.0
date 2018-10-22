const dirVars = require('./base/dir-vars.config.js')
let moduleConfig = require('./inherit/module.config.js')
let MiniCssExtractPlugin = require("mini-css-extract-plugin")

moduleConfig.rules.push({
    test: /\.css$/,
    exclude: /node_modules|bootstrap/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                minimize: true
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins: (loader) => [
                    require('precss'),
                    require('autoprefixer')({
                        browsers: [
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
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader'
        }
    ]
})

moduleConfig.rules.push({
    test: /\.scss$/,
    include: dirVars.srcRootDir,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                minimize: true
            }
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
        }, {
            loader: 'sass-loader' // 将 Sass 编译成 CSS
        }
    ]
})

module.exports = moduleConfig
