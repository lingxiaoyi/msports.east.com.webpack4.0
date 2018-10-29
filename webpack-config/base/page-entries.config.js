let glob = require('glob')
let dirVars = require('./dir-vars.config.js')
const devServer = process.argv.join('').indexOf('webpack-dev-server') !== -1
let options = {
    cwd: dirVars.pagesDir, // 在pages目录里找
    sync: true // 这里不能异步，只能同步
}
let minimatch = 'hc|theme|jingcai|sougou|ty_jingcai' //!(_)*/!(_)* 代表匹配2级目录 不包含_开始的目录
let globInstance1
let globInstance2
if (devServer) {
    //index|liveing|data_world_up_duel|detail|video|video_other|data|
    /*let minimatch = 'index|saishi|detail' //本地环境需调试的1级页面
    globInstance1 = new glob.Glob(`?(${minimatch})`, options)
    //|hc//本地环境需调试的2级页面 |detail_nostart|experts_page|login2|recharge|index|order|message|message_detail|stop_notice|personal
    //globInstance2 = new glob.Glob('?(theme|hc)/!(_)*', options) |order-single|expertslist|experts_page|detail_nostart|plan_list
    globInstance2 = new glob.Glob('?(theme|hc)/?(index|login2|recharge|detail_nostart|order-single|experts_page|order|expertslist|order)', options)*/
    globInstance1 = new glob.Glob(`!(_|${minimatch})*`, options)
    globInstance2 = new glob.Glob(`?(${minimatch})/!(_)*`, options)
} else {
    globInstance1 = new glob.Glob(`!(_|${minimatch})*`, options)
    globInstance2 = new glob.Glob(`?(${minimatch})/!(_)*`, options)
    /* let minimatch = 'index|saishi|detail|detail.1' //本地环境需调试的1级页面
    globInstance1 = new glob.Glob(`?(${minimatch})`, options)
    globInstance2 = new glob.Glob('?(theme|hc)/?(index)', options) */
}
// console.log(globInstance1.found.concat(globInstance2.found))
// debug
module.exports = globInstance1.found.concat(globInstance2.found) // 一个数组，形如['index/index', 'index/login', 'alert/index']
