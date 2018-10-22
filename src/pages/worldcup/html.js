
const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '2018世界杯_2018世界杯赛程_东方体育'
const pageKeywords = '2018世界杯,2018世界杯赛程'
const pageDescription = '东方体育2018世界杯专题，汇总2018俄罗斯世界杯的全部赛程和比赛资讯，包括德国队、巴西队、阿根廷队、法国队等32强赛程表，以及内马尔、梅西、苏神等世界杯50大球星最新战况等。'
let canonical = `http://sports.eastday.com`
const hasLogo = false //判断有没有logo栏
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    hasLogo,
}).run(content())
