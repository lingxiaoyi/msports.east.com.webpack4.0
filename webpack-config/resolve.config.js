let path = require('path')
let dirVars = require('./base/dir-vars.config.js')
module.exports = {
    // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
    alias: {
        /* 各种目录 */
        pages: path.resolve(dirVars.srcRootDir, 'pages/'),
        iconfontDir: path.resolve(dirVars.publicDir, 'iconfont/'),
        configDir: dirVars.configDir,
        vendorDir: dirVars.vendorDir,
        public: path.resolve(dirVars.srcRootDir, 'public-resource/'),
        /* vendor */
        /* bootstrap 相关 */
        metisMenu: path.resolve(dirVars.vendorDir, 'metisMenu/'),

        /* libs */
        withoutJqueryModule: path.resolve(dirVars.libsDir, 'without-jquery.module'),
        routerModule: path.resolve(dirVars.libsDir, 'router.module'),

        libs: path.resolve(dirVars.libsDir, 'libs.module'),

        /* less */
        lessDir: path.resolve(dirVars.publicDir, 'less'),

        /* components */

        /* layout */
        layout: path.resolve(dirVars.layoutDir, 'layout/html'),
        'layout-without-logo': path.resolve(dirVars.layoutDir, 'layout-without-logo/html'),

        /* logic */
        cm: path.resolve(dirVars.logicDir, 'common.module'),
        cp: path.resolve(dirVars.logicDir, 'common.page'),

        /* config */
        configModule: dirVars.configModule
    },

    // 当require的模块找不到时，尝试添加这些后缀后进行寻找
    extensions: ['.js', '.css', '.less']
}
