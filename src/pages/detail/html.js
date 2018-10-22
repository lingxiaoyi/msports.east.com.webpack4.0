const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '$!{page.title}_东方体育'
const pageKeywords = '$!{page.tags}'
const pageDescription = '$!{description}'
const canonical = 'http://sports.eastday.com/a/$!{page.htmlname}'
const hasLogo = false
scriptHtml = scriptHtml()
config.tagMap = '${tagMap.entrySet()}'
config.key = '${param.key}'
config.value = '${param.value}'
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    scriptHtml,
    hasLogo
}).run(content(config))
