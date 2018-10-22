const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '东方体育手机版_NBA直播|CBA直播|足球直播|英超直播吧|CCTV5体育直播平台'
const pageKeywords = '东方体育,NBA直播,足球直播,体育直播平台,东方体育,英超直播,CCTV5在线直播,CBA直播,NBA视频直播,在线观看,体育精彩集锦'
const pageDescription = '东方体育手机版是东方网旗下的体育直播及体育资讯平台，提供NBA/CBA体育赛事直播,英超/中超等足球直播,还有更多精彩体育赛事视频集锦在线观看,了解最新足球/篮球等体育赛程，敬请关注东方体育！'
let canonical = `http://msports.eastday.com/saishi.html`
const hasLogo = false
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
