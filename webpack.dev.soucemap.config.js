module.exports = {
    entry: require('./webpack-config/entry.config.js'),

    output: require('./webpack-config/output.config.js'),

    module: require('./webpack-config/module.dev.soucemap.config.js'), //开启css soucemap

    resolve: require('./webpack-config/resolve.config.js'),

    plugins: require('./webpack-config/plugins.dev.config.js'),

    externals: require('./webpack-config/externals.config.js'),

    devtool: 'inline-source-map',

    devServer: require('./webpack-config/vendor/devServer.config.js')
}
