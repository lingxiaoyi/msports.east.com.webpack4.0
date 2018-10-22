const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '2018中国杯_2018格力·中国杯国际足球锦标赛_东方体育'
const pageKeywords = '中国杯,2018格力·中国杯,中国杯国际足球锦标赛'
const pageDescription = '2018中国杯国际足球锦标赛（全称：2018格力·中国杯国际足球锦标赛）于2018年3月22日-3月26日在南宁市广西体育中心举行，共有包括东道主（中国）在内的四支球队参赛，其余分别是乌拉圭、威尔士、捷克。乌拉圭在2018年俄罗斯世界杯南美区预选赛中力压老牌足球劲旅阿根廷队，；威尔士国家队中一直不乏世界顶尖球员；捷克队与中国足球颇具渊源，河南建业俱乐部的多奇卡尔正是捷克国家队队员。'
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
