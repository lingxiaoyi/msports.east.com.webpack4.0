const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = 'NBA季后赛对阵图_NBA季后赛对战表_东方体育NBA赛程'
const pageKeywords = 'NBA季后赛对阵图,NBA季后赛对战表,NBA赛程'
const pageDescription = '东方体育NBA季后赛对阵图页面包含2018年NBA季后赛对战表和NBA季后赛赛程表。其中包括火箭队、骑士队、勇士队、猛龙队、凯尔特人队、雷霆队、马刺队、76人队、鹈鹕队等12支NBA战队。让我们一起看哈登、詹姆斯、欧文、浓眉等NBA巨星再NBA季后赛对战中的精彩表现吧！'
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
