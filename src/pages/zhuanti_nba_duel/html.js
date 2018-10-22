const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = 'NBA季后赛_NBA季后赛赛程|新闻|对战表_东方体育'
const pageKeywords = 'NBA季后赛,NBA季后赛赛程,NBA季后赛新闻,NBA季后赛对战表'
const pageDescription = '2018年NBA季后赛于4月16日开战。东方体育为您提供最新NBA季后赛赛程安排、最精彩的新闻和视频、还有东西部NBA球队的对战表和得分榜。NBA季后赛西部八强为：勇士、马刺、火箭、快船、爵士、雷霆、灰熊和开拓者；东部为：凯尔特人、骑士、猛龙、奇才、老鹰、雄鹿、步行者、公牛。快来一起看NBA季后赛吧'
const hasLogo = false //判断有没有logo栏
scriptHtml = scriptHtml()
const canonical = 'http://sports.eastday.com/zhuanti.html'
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    hasLogo,
    canonical
}).run(content(config))
