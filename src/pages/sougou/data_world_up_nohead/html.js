const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '2018世界杯赛程表_2018世界杯对阵图|小组赛|淘汰赛|决赛_东方体育'
const pageKeywords = '2018世界杯赛程表,世界杯对阵图,世界杯小组赛,世界杯淘汰赛,世界杯决赛'
const pageDescription = '东方体育2018世界杯赛程表专题，覆盖2018俄罗斯世界杯的全部比赛数据，如世界杯小组赛|淘汰赛|决赛的对阵图、积分榜、射手榜。还有对应世界杯赛程的相关资讯，和球星进球动态。'
const hasLogo = false //判断有没有logo栏
scriptHtml = scriptHtml()
const canonical = 'http://sports.eastday.com/data_nba_duel.html'
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    hasLogo,
    canonical
}).run(content(config))
