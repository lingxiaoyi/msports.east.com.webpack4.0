const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '东2018中国杯-球星见面会【现场直播】'
const pageKeywords = '2018中国杯,球星见面会'
const pageDescription = ' 2018中国杯-球星见面会正在现场直播中，邀请了贝尔、里皮、苏亚雷斯等众多足球明星与大家见面，快来一起约起来吧。'
let canonical = `http://sports.eastday.com/zhibo_jmh.html`
const hasLogo = false
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
