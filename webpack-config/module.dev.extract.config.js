const ExtractTextPlugin = require('extract-text-webpack-plugin')
const dirVars = require('./base/dir-vars.config.js')
let moduleConfig = require('./inherit/module.config.js')

moduleConfig.rules.push({
    test: /\.css$/,
    exclude: /node_modules|bootstrap/,
    use: ExtractTextPlugin.extract([
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
                            'last 2 versions'
                        ],
                        cascade: false,
                        remove: false
                    })
                ]
            }
        }
    ])
})

moduleConfig.rules.push({
    test: /\.css$/,
    include: /bootstrap/,
    use: ExtractTextPlugin.extract([
        {
            loader: 'css-loader'
        }
    ])
})

moduleConfig.rules.push({
    test: /\.scss$/,
    include: dirVars.srcRootDir,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: (loader) => [
                        require('precss'),
                        require('autoprefixer')({
                            broswers: [
                                'last 2 versions'
                            ],
                            cascade: false,
                            remove: false
                        })
                    ]
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }
        ]
    })
})

module.exports = moduleConfig
