const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '$!{page.title}_东方体育'
const pageKeywords = '$!{page.tags}'
const pageDescription = '$!{page.title}高清图集作品欣赏。'
const hasLogo = false //判断有没有logo栏
scriptHtml = scriptHtml()
const canonical = 'http://sports.eastday.com/a/$!{page.htmlname}'
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    hasLogo,
    canonical
}).run(content(config))
