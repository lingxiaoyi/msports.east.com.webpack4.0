const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '全国空手道锦标系列赛第一站'
const pageKeywords = '空手道,锦标系列赛'
const pageDescription = ' 2018年全国空手道锦标系列赛一共四站。  第一站比赛时间：2018年4月11日至15日（4月11日报到，4月16日离会）。其'
let canonical = `http://sports.eastday.com/zhibo_tqd.html`
const hasLogo = false
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
