const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '红彩专家篮彩砖家的个人主页_篮彩|足彩分析专家_红彩达人'
const pageKeywords = '红彩专家,篮彩砖家'
const pageDescription = '红彩达人专家篮彩砖家，专业篮彩专家，主推NBA，从事博彩事业多年，主要做盘口分析，对亚盘主流博彩公司的操盘手法颇有研究，积累了丰富的经验，也取得的比较显著的成绩。祝大家多多红单，发大财。。篮彩砖家对赛事预测分析还是不错的，深得广大足彩喜爱。更多篮彩、足彩专家尽在红彩达人。'
const canonical = 'http://sports.eastday.com/experts_page.html'
const hasLogo = false
scriptHtml = scriptHtml()
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    scriptHtml,
    hasLogo
}).run(content(config))
