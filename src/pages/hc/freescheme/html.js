const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '东方体育竞彩方案推荐_专业的篮彩|足彩分析平台'
const pageKeywords = '竞彩方案推荐,足彩分析,篮彩分析'
const pageDescription = '东方体育竞彩方案推荐汇集百余位篮彩、足彩赛事分析专家。例如可查询足球比分、足球预测分析、足球赔率等，权威足彩专家不同角度对篮球|足球比分精准的预测分析，专业的足彩推荐方案为你的竞彩竞猜添砖加瓦。再结合足球比分大数据分析系统，倾力打造专业的篮彩、足彩分析平台。'
let canonical = `http://sports.eastday.com`
const hasLogo = false //判断有没有logo栏
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    hasLogo,
}).run(content())
