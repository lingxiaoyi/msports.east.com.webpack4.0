module.exports = {
    entry: require('./webpack-config/entry.config.js'),

    output: require('./webpack-config/output.config.js'),

    module: require('./webpack-config/module.dev.config.js'),
    //module: require('./webpack-config/module.dev.extract.config.js'), //尽量不要用 提取会影响速度  并且会影响样式的热记载

    resolve: require('./webpack-config/resolve.config.js'),

    plugins: require('./webpack-config/plugins.dev.config.js'),

    externals: require('./webpack-config/externals.config.js'),

    //devtool: 'cheap-module-eval-source-map', //inline-source-map

    devServer: require('./webpack-config/vendor/devServer.config.js'),

    mode: 'development',

    optimization: require('./webpack-config/optimization.js'),
}
