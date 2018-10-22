const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '我的竞猜'
const pageKeywords = '东方体育'
const pageDescription = '东方体育'
const canonical = ''
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
