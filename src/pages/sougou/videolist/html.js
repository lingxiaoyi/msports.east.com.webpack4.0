const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = 'NBA|东方体育手机版_东方体育'
const pageKeywords = '东方体育,NBA直播,足球直播,体育直播平台,东方体育,英超直播,CCTV5在线直播,CBA直播,NBA视频直播,在线观看,体育精彩集锦'
const pageDescription = '东方体育手机版提供NBA/CBA体育赛事直播,英超/中超等足球直播,还有更多精彩体育赛事视频集锦在线观看,了解最新足球/篮球等体育赛程，敬请关注东方体育！'
const hasLogo = false
let canonical = `http://msports.eastday.com/videolist.html`
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
