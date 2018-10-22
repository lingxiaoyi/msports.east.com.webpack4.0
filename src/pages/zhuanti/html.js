const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '2018平昌冬奥会_2018冬奥会赛程|新闻_东方体育'
const pageKeywords = '2018冬奥会,平昌冬奥会,冬奥会赛程,冬奥会新闻'
const pageDescription = '东方体育全面报道2018冬奥会开幕式|闭幕式、平昌冬奥会奖牌榜、2018冬奥会热门项目的赛程、冬奥会中国军团的比赛新闻|视频|图集等。2018平昌冬奥会于2月9日-25日正式召开，汇集国内外运动员角逐包括短道速滑、花样滑冰、速度滑冰、冰壶、滑雪、冰球、雪车、雪橇等15大冰雪运动。还有2018冬奥会中毒、违规、打架、志愿者抗议等突发事件跟踪报道哦。'
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
