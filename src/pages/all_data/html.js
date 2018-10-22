const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '体育数据大全|积分榜|排名表_东方体育'
const pageKeywords = '积分榜，排名表，体育数据库，体育数据大全'
const pageDescription = '东方体育数据频道提供最全的体育赛事数据，篮球排名表，足球积分榜，所有球队历史数据大全，想了解球队的完整数据就在东方体育。'
let canonical = `http://msports.eastday.com/all_data.html`
const hasLogo = false //判断有没有logo栏
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    hasLogo
}).run(content())
