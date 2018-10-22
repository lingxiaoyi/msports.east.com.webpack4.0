const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    namedChunks: true, //moduleIds: 'hashed',
    runtimeChunk: {
        name: 'manifest'
    },
    minimizer: [
        new UglifyJsPlugin({ parallel: true }),
        new OptimizeCSSAssetsPlugin({})
    ]
}
