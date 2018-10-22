const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '世界杯24小时跟踪_2018世界杯赛程在线直播报道'
const pageKeywords = '世界杯24小时跟踪,2018世界杯赛程,世界杯赛程直播,世界杯在线报道'
const pageDescription = '东方体育倾力24小时跟踪报道2018世界杯，包括在线直播报道世界杯全部赛程，世界杯中C罗、梅西、内马尔等足球球星最新动态，世界杯中德国、法国、巴西等国家队最新战术状态和得分排名情况，还会跟踪报道2018俄罗斯世界杯各场馆及球迷情况。'
const canonical = 'http://msports.eastday.com/theme/hour24.html?qid=qid10601'
const hasLogo = false
scriptHtml = scriptHtml()
config.tagMap = '${tagMap.entrySet()}'
config.key = '${param.key}'
config.value = '${param.value}'
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    scriptHtml,
    hasLogo
}).run(content(config))
