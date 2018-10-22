const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
let scriptHtml = require('./templates/script-var.ejs')
const layout = require('layout')
const pageTitle = '东方体育手机版_NBA直播|CBA直播|足球直播|英超直播吧|CCTV5在线直播'
const pageKeywords = 'NBA直播,足球直播,体育直播平台,东方体育手机版,英超直播吧,CCTV5在线直播,CBA直播'
const pageDescription = '东方体育是东方网旗下的体育直播及体育资讯平台，东方体育手机版也可在线直播NBA/CBA体育赛事直播,英超/中超等足球直播,还可在线观看更多精彩体育赛事视频集锦和海量最新的体育新闻资讯,关注东方体育手机版，每一秒都有你的世界！'
let canonical = `http://sports.eastday.com`
const hasLogo = false //判断有没有logo栏
scriptHtml = scriptHtml()
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    scriptHtml,
    hasLogo,
}).run(content())
