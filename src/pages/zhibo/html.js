const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '威尔士大战乌拉圭，中国杯巅峰对决火热直播中'
const pageKeywords = '2018中国杯，威尔士大战乌拉圭'
const pageDescription = '2018年3月26日中国杯第二战：威尔士vs乌拉圭，正在高清直播中，快来观看吧'
let canonical = `http://sports.eastday.com/zhibo.html`
const hasLogo = false
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
